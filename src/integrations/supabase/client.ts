// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zoqdrpmabznskhzhpgbl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcWRycG1hYnpuc2toemhwZ2JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzcyNjksImV4cCI6MjA2NDY1MzI2OX0.b7nONSuo6FDK4fakVDjGR5_llxlZ9Z7RFbHM0z6myZQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);