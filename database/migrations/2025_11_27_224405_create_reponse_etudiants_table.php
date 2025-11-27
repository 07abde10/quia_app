<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reponse_etudiants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tentative_id')->constrained('tentatives')->onDelete('cascade');
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->foreignId('choix_id')->constrained('choix_reponses')->onDelete('cascade');
            $table->boolean('est_correct')->nullable();
            $table->timestamps();
            
            // Une seule réponse par question et par tentative
            $table->unique(['tentative_id', 'question_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('reponse_etudiants');
    }
};