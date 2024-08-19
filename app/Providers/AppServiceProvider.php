<?php

namespace App\Providers;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        try {
            foreach (Permission::pluck('name') as $permission) {
                // defining a gate for each permission
                Gate::define($permission, function ($user) use ($permission) {
                    return $user->roles()->whereHas('permissions', function (Builder $q) use ($permission) {
                        $q->where('name', $permission);
                    })->exists();
                });
            }
        } catch (QueryException $e) {

        }
    }
}
