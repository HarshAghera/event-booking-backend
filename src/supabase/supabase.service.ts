import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public readonly client: SupabaseClient<any, 'public', 'public'>;

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

    if (!url || !key) throw new Error('Missing Supabase environment variables');

    this.client = createClient<any, 'public', 'public'>(url, key);
  }
}
