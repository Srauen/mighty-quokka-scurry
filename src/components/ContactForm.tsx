"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { sendEmail } from '@/utils/email'; // Reusing the email utility

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Insert message into Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({ name, email, subject, message });

    if (dbError) {
      console.error('Error saving contact message:', dbError);
      toast.error("Submission Failed", { description: "There was an error sending your message. Please try again." });
      setLoading(false);
      return;
    }

    // 2. Send email notification to admin
    const adminEmail = "sriramvatsans@gmail.com"; // Replace with your admin email
    const emailBody = `
      <h1>New Contact Message from Stock OS</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p>This message was submitted via the Stock OS contact form.</p>
    `;

    const { success: emailSuccess, error: emailError } = await sendEmail({
      to: adminEmail,
      subject: `New Contact: ${subject || 'No Subject'} from ${name}`,
      body: emailBody,
    });

    if (!emailSuccess) {
      console.error('Error sending admin email notification:', emailError);
      // Still show success to user, but log admin email failure
    }

    toast.success("Message Sent!", { description: "Thank you for contacting us. We'll get back to you soon!" });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div>
        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Your Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Your Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">Subject (Optional)</Label>
        <Input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <div>
        <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Your Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="mt-1 block w-full bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-lg py-3"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
};

export default ContactForm;