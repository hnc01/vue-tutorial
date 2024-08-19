<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model {
    protected $fillable = ['name'];

    // a permission can belong to more than one role: belongs
    // a role can have more than one permission: many
    public function permissions(): BelongsToMany {
        return $this->belongsToMany(Permission::class);
    }

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class);
    }
}
