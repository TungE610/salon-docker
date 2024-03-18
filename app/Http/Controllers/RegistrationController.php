<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Registration;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index()
    {
        $registrations = Registration::all();

        foreach ($registrations as $registration) {
            $registration->status = config('app.registration_status')[$registration->status];
            $registration->package = config('app.package')[$registration->package_id];
            $registration->key = $registration->id;
            $registration->description = "Contact person: {$registration->first_name} {$registration->last_name}. Seats Number: {$registration->seats_number}. Staff Number: {$registration->staffs_number}";
        }

        $sortedRegistrations = $registrations->sortBy(
            [
                ['status', 'desc'],
                ['created_at', 'desc'],
            ]
        );

        return Inertia::render(
            'Registrations',
            [
                'registrations' => $sortedRegistrations,
            ]
        );
    }

    public function reject(Request $request, Registration $registration)
    {
        $registration_status = collect(config('app.registration_status'));
        $rejected_id = $registration_status->search('Rejected');

        try {
            $registration->update(['status'=> $rejected_id]);
        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'reject' => $e->getMessage(),
                ]
            );
        }
        
        return redirect()->route('registrations.index');
    }

    public function note(Request $request, Registration $registration)
    {

        try {
            $registration->update(['note' => $request['edittingNote']]);

        } catch (Exception $e) {
            return redirect()->back()->withErrors(
                [
                    'reject' => $e->getMessage(),
                ]
            );
        }
        
        return redirect()->route('registrations.index');
    }
}
