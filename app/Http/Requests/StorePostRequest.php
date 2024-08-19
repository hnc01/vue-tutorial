<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'title' => ['required'],
            'content' => ['required'],
            'category_id' => ['required', 'exists:categories,id'],
        ];
    }

    // this just changes the way the field is named in the error message
    public function attributes(): array {
        return [
            'category_id' => 'category',
        ];
    }
}
