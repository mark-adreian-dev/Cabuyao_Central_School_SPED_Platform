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
     * @return array<mixed>         An array of paths to the stored files.
     * Invalid or non-UploadedFile items are filtered out.
     */
    public function storeFiles(array $files, string $directory, string $disk): array
    {
        $storedFilePaths = [];
        foreach ($files as $file) {
            try {
                $path = Storage::disk($disk)->putFile($directory, $file);
                $storedFilePaths[] = ["path" => $path, "file_name" => $file->getClientOriginalName(), "file_size" => $file->getSize()];
            } catch (\Throwable $th) {
                return [];
            }
        }
        return $storedFilePaths;
    }

    /**
     * Stores an array of uploaded files to the specified disk and directory.
     * Only processes items that are valid UploadedFile instances.
     *
     * @param UploadedFile $files       An array that may contain UploadedFile objects or other mixed types.
     * @param string                    $directory   The directory within the disk to store files (e.g., 'avatars', 'product_images').
     * @param string                    $disk        The storage disk to use (e.g., 'public', 's3').
     * @return array<mixed>         An array of paths to the stored files.
     * Invalid or non-UploadedFile items are filtered out.
     */
    public function storeFile(UploadedFile $file, string $directory, string $disk): array
    {
        try {
            $path = Storage::disk($disk)->putFile($directory, $file);
            $storedFilePaths = ["path" => $path, "file_name" => $file->getClientOriginalName(), "file_size" => $file->getSize()];
        } catch (\Throwable $th) {
            return [];
        }

        return $storedFilePaths;
    }

    /**
     * Delete a file from the given disk.
     *
     * @param string $path
     * @param string|null $disk
     * @return bool
     */
    public function deleteFile(string $path, string $disk = null): bool
    {
        $disk = $disk ?? config('filesystems.default');
        return Storage::disk($disk)->delete($path);
    }
}