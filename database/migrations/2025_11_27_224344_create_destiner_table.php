<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('destiner', function (Blueprint $table) {
            $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->timestamps();
            $table->primary(['quiz_id', 'groupe_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('destiner');
    }
};