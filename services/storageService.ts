
import { supabase } from './supabase';

const BUCKET = 'dreamcast-assets';

export const storageService = {

    /**
     * Uploads a file (Image/Audio) to the storage bucket.
     * Suggested path format: `user_id/stories/timestamp_filename`
     */
    async uploadFile(path: string, file: File | Blob): Promise<string | null> {
        if (!supabase) return null;

        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Storage Upload Error:', error);
            throw error;
        }

        return this.getPublicUrl(path);
    },

    /**
     * Returns the publicly accessible URL for a given path.
     */
    getPublicUrl(path: string): string {
        if (!supabase) return '';
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        return data.publicUrl;
    },

    /**
     * Helper to upload a story cover image
     */
    async uploadStoryCover(userId: string, storyId: string, imageBlob: Blob): Promise<string | null> {
        const path = `${userId}/stories/${storyId}/cover.jpg`;
        return this.uploadFile(path, imageBlob);
    },

    /**
     * Helper to upload story audio
     */
    async uploadStoryAudio(userId: string, storyId: string, audioBlob: Blob): Promise<string | null> {
        const path = `${userId}/stories/${storyId}/audio.mp3`;
        // Ensure correct content type for audio
        const file = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' });
        return this.uploadFile(path, file);
    }
};
