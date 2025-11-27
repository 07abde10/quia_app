<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up()
    {
        Schema::create('enseigner', function (Blueprint $table) {
            $table->foreignId('professeur_id')->constrained('professeurs')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->timestamps();
            $table->primary(['professeur_id', 'module_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('enseigner');
    }
};
