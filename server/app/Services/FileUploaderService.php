<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection; // To use Laravel's Collection for results

class FileUploaderService
{
    /**
     * Stores an array of uploaded files to the specified disk and directory.
     * Only processes items that are valid UploadedFile instances.
     *
     * @param array<UploadedFile|mixed> $files       An array that may contain UploadedFile objects or other mixed types.
     * @param string                    $directory   The directory within the disk to store files (e.g., 'avatars', 'product_images').
     * @param string                    $disk        The storage disk to use (e.g., 'public', 's3').
     * @return array<string>            An array of paths to the stored files.
     * Invalid or non-UploadedFile items are filtered out.
     */
    public function storeFiles(array $files, string $directory, string $disk): array
    {
        foreach ($files as $file) {
            if (!$file instanceof UploadedFile || !$file->isValid()) {
                return ["error"];
            }
        }

        $storedFilePaths = [];
        foreach ($files as $file) {
            $path = Storage::disk($disk)->put($directory, $file);
            $storedFilePaths[] = $path;
        }

        return $storedFilePaths;
    }

    /**
     * Stores a single uploaded file.
     *
     * @param UploadedFile $file        The UploadedFile object.
     * @param string       $directory   The directory within the disk to store the file.
     * @param string       $disk        The storage disk to use.
     * @return string|null              The path to the stored file, or null if the file is invalid.
     */
    public function storeSingleFile(UploadedFile $file, string $directory, string $disk = 'public'): ?string
    {
        if ($file->isValid()) {
            return Storage::disk($disk)->putFile($directory, $file);
        }
        return null;
    }
}