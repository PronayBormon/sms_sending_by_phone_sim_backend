import './styles.css';

type TimeValue = Date | number;

export interface BookingInformation {
    bookingId: string;
    guest: string;
    property: string;
    status: string;
    amount: string;
}

export interface TimeLineRange {
    start: TimeValue;
    end: TimeValue;
    color?: string;
    booking?: BookingInformation;
}

export interface TimeLineItem {
    label: string;
    start?: TimeValue;
    end?: TimeValue;
    color?: string;
    booking?: BookingInformation;
    ranges?: TimeLineRange[];
}

interface TimeLineChartProps {
    items: TimeLineItem[];
    startDate: TimeValue;
    endDate: TimeValue;
    height?: number;
}

const asTimestamp = (value: TimeValue) =>
    value instanceof Date ? value.getTime() : value;

const formatDate = (value: number) =>
    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const itemRanges = (item: TimeLineItem): TimeLineRange[] => {
    if (item.ranges) {
        return item.ranges;
    }

    if (item.start !== undefined && item.end !== undefined) {
        return [{ start: item.start, end: item.end, color: item.color, booking: item.booking }];
    }

    return [];
};

export default function TimeLineChart({
    items,
    startDate,
    endDate,
    height = 300,
}: TimeLineChartProps) {
    const start = asTimestamp(startDate);
    const end = asTimestamp(endDate);
    const duration = Math.max(end - start, 1);
    const ticks = Array.from({ length: 7 }, (_, index) =>
        formatDate(start + (duration * index) / 6),
    );

    return (
        <div className="timeline-chart" style={{ minHeight: height }}>
            <div className="timeline-chart__axis">
                <span>Bookings</span>
                <div className="timeline-chart__ticks">
                    {ticks.map((tick, index) => <span key={`${tick}-${index}`}>{tick}</span>)}
                </div>
            </div>
            <div className="timeline-chart__body">
                {items.map((item) => {
                    const lanes: TimeLineRange[][] = [];
                    const sortedRanges = [...itemRanges(item)].sort(
                        (first, second) => asTimestamp(first.start) - asTimestamp(second.start),
                    );

                    sortedRanges.forEach((range) => {
                        const rangeStart = asTimestamp(range.start);
                        const availableLane = lanes.find((lane) => {
                            const previousRange = lane[lane.length - 1];

                            return asTimestamp(previousRange.end) < rangeStart;
                        });

                        if (availableLane) {
                            availableLane.push(range);
                        } else {
                            lanes.push([range]);
                        }
                    });

                    return lanes.map((lane, laneIndex) => (
                        <div className="timeline-chart__row" key={`${item.label}-${laneIndex}`}>
                            <span className="timeline-chart__label">
                                {laneIndex === 0 ? item.label : ''}
                            </span>
                            <div className="timeline-chart__track">
                                {lane.map((range, index) => {
                                const bookingStart = asTimestamp(range.start);
                                const bookingEnd = asTimestamp(range.end);
                                const left = Math.max(0, Math.min(100, ((bookingStart - start) / duration) * 100));
                                const right = Math.max(0, Math.min(100, ((bookingEnd - start) / duration) * 100));
                                const width = Math.max(2, right - left);
                                const booking = range.booking;

                                return (
                                    <span
                                        className="timeline-chart__bar"
                                        key={`${bookingStart}-${bookingEnd}-${index}`}
                                        role="img"
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`,
                                            backgroundColor: range.color ?? item.color ?? '#6258cc',
                                        }}
                                        tabIndex={0}
                                    >
                                        <span className="timeline-chart__bar-label">{booking?.bookingId ?? 'Booked'}</span>
                                        <span className="timeline-chart__tooltip" role="tooltip">
                                            <strong>{booking?.guest ?? item.label}</strong>
                                            <span>{booking?.bookingId ?? 'Booking details'}</span>
                                            <span>{formatDate(bookingStart)} – {formatDate(bookingEnd)}</span>
                                            {booking && <span>{booking.property}</span>}
                                            {booking && <span className="timeline-chart__tooltip-footer">{booking.status} · {booking.amount}</span>}
                                        </span>
                                    </span>
                                );
                                })}
                            </div>
                        </div>
                    ));
                })}
            </div>
        </div>
    );
}
