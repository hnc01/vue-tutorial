<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->foreignId('category_id')->after('content')->constrained();
        });
    }

    public function down(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign('posts_category_id_foreign');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('category_id');
        });
    }
};
