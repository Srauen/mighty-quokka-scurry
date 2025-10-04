import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export const sendEmail = async ({ to, subject, body }: SendEmailParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, body },
    });

    if (error) {
      console.error('Error invoking send-email function:', error);
      toast.error("Email Failed", { description: error.message });
      return { success: false, error: error.message };
    }

    toast.success("Email Sent", { description: data.message });
    return { success: true, message: data.message };
  } catch (error: any) {
    console.error('Unexpected error sending email:', error);
    toast.error("Email Failed", { description: error.message || "An unexpected error occurred." });
    return { success: false, error: error.message };
  }
};

// Re-export existing toast utilities
export { showSuccess, showError, showLoading, dismissToast } from './toast';