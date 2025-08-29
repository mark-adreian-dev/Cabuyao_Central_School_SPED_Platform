<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Lesson;
use App\Models\Activity;

class CommentController extends Controller
{
    public function getLessonComments(Lesson $lesson)
    {
        $comments = $lesson->comments()->with('user')->get();
        return response()->json($comments);
    }

    public function getActivityComments(Activity $activity)
    {
        $comments = $activity->comments()->with('user')->get();
        return response()->json($comments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'comment' => 'required|string',
            'commentable_id' => 'required',
            'commentable_type' => 'required|string|in:App\Models\Lesson,App\Models\Activity',
        ]);

        $commentable = $request->commentable_type::findOrFail($request->commentable_id);

        $comment = $commentable->comments()->create([
            'user_id' => auth()->id(),
            'comment' => $request->comment,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function show(Comment $comment)
    {
        return response()->json($comment->load('user'));
    }

    public function update(Request $request, Comment $comment)
    {
        $request->validate([
            'comment' => 'required|string',
        ]);

        $comment->update($request->only('comment'));

        return response()->json($comment->load('user'));
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return response()->json(null, 204);
    }
}