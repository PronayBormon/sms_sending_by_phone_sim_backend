<?php

namespace App\Http\Controllers\API\Campaign;

use App\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\Campaign\CampaignAnalyticsService;
use App\Services\Campaign\CampaignService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class CampaignApiController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected CampaignService $service,
        protected CampaignAnalyticsService $analyticsService
    ) {}

    public function index(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $status = $request->input('status', 'all');
            $perPage = $request->input('per_page', 15);
            
            $data = $this->service->listCampaigns($status, $perPage);

            return $this->successResponse('Campaigns retrieved successfully.', $data);
        });
    }

    public function store(Request $request): JsonResponse
    {
        return $this->respondSafely(function () use ($request) {
            $data = $request->validate([
                'campaign_name' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'campaign_type' => ['sometimes', 'string', 'in:regular,automated,ab_test'],
                'tags' => ['nullable', 'array'],
                'template_id' => ['nullable', 'integer'],
                'smtp_id' => ['nullable', 'integer'],
                'recipient_list_ids' => ['nullable', 'array'],
                'from_name' => ['nullable', 'string', 'max:255'],
                'from_email' => ['nullable', 'email', 'max:255'],
                'reply_email' => ['nullable', 'email', 'max:255'],
                'subject_line' => ['nullable', 'string', 'max:255'],
                'preview_text' => ['nullable', 'string'],
                'schedule_type' => ['sometimes', 'string', 'in:now,later'],
                'date' => ['nullable', 'date'],
                'time' => ['nullable', 'date_format:H:i'],
                'timezone' => ['nullable', 'string'],
                'status' => ['sometimes', 'string', 'in:draft,scheduled,sending,completed,paused,failed'],
            ]);

            $campaign = $this->service->storeCampaign($data);

            return $this->successResponse('Campaign saved successfully.', $campaign, 201);
        });
    }

    public function show($id): JsonResponse
    {
        return $this->respondSafely(function () use ($id) {
            $campaign = $this->service->showCampaign($id);

            return $this->successResponse('Campaign retrieved successfully.', $campaign);
        });
    }

    public function update(Request $request, $id): JsonResponse
    {
        return $this->respondSafely(function () use ($request, $id) {
            $data = $request->validate([
                'campaign_name' => ['sometimes', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'campaign_type' => ['sometimes', 'string', 'in:regular,automated,ab_test'],
                'tags' => ['nullable', 'array'],
                'template_id' => ['nullable', 'integer'],
                'smtp_id' => ['nullable', 'integer'],
                'recipient_list_ids' => ['nullable', 'array'],
                'from_name' => ['nullable', 'string', 'max:255'],
                'from_email' => ['nullable', 'email', 'max:255'],
                'reply_email' => ['nullable', 'email', 'max:255'],
                'subject_line' => ['nullable', 'string', 'max:255'],
                'preview_text' => ['nullable', 'string'],
                'schedule_type' => ['sometimes', 'string', 'in:now,later'],
                'date' => ['nullable', 'date'],
                'time' => ['nullable', 'date_format:H:i'],
                'timezone' => ['nullable', 'string'],
                'status' => ['sometimes', 'string', 'in:draft,scheduled,sending,completed,paused,failed'],
            ]);

            $campaign = $this->service->updateCampaign($id, $data);

            return $this->successResponse('Campaign updated successfully.', $campaign);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->respondSafely(function () use ($id) {
            $this->service->deleteCampaign($id);

            return $this->successResponse('Campaign deleted successfully.');
        });
    }

    public function analytics($id): JsonResponse
    {
        return $this->respondSafely(function () use ($id) {
            $analytics = $this->analyticsService->getAnalytics($id);

            return $this->successResponse('Campaign analytics retrieved successfully.', $analytics);
        });
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse|JsonResponse
    {
        try {
            $campaigns = $this->service->listCampaigns('all', 1000)['campaigns'];
            
            $headers = array(
                "Content-type"        => "text/csv",
                "Content-Disposition" => "attachment; filename=campaigns.csv",
                "Pragma"              => "no-cache",
                "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
                "Expires"             => "0"
            );

            $columns = ['ID', 'Name', 'Status', 'Type', 'Recipients', 'Date'];

            $callback = function() use($campaigns, $columns) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $columns);

                foreach ($campaigns as $campaign) {
                    $row['ID']  = $campaign['id'];
                    $row['Name']    = $campaign['campaign_name'];
                    $row['Status']    = $campaign['status'];
                    $row['Type']  = $campaign['campaign_type'] ?? 'regular';
                    $row['Recipients']  = $campaign['recipients'];
                    $row['Date']  = $campaign['date'];

                    fputcsv($file, array($row['ID'], $row['Name'], $row['Status'], $row['Type'], $row['Recipients'], $row['Date']));
                }

                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        } catch (Throwable $e) {
            report($e);
            return $this->errorResponse('Failed to export campaigns.', 500);
        }
    }

    private function respondSafely(\Closure $callback): JsonResponse
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            return $this->errorResponse($e->getMessage(), 422, $e->errors());
        } catch (HttpExceptionInterface $e) {
            return $this->errorResponse($e->getMessage() ?: 'Request failed.', $e->getStatusCode());
        } catch (Throwable $e) {
            report($e);
            return $this->errorResponse('Something went wrong. Please try again later.', 500);
        }
    }
}
