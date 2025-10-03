"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-950 text-white p-6">
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-700 shadow-lg mt-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-400">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none text-gray-300">
          <p>
            Welcome to Stock OS! These Terms of Service ("Terms") govern your access to and use of the Stock OS website, products, and services (collectively, "Service"). Please read these Terms carefully before using our Service.
          </p>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.
          </p>
          <h2>2. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
          </p>
          <h2>3. Use of Service</h2>
          <p>
            Stock OS provides tools and insights for simulated stock trading and market analysis. The Service is for informational and educational purposes only and should not be considered financial advice. We are not a broker-dealer, investment adviser, or financial institution.
          </p>
          <h2>4. User Accounts</h2>
          <p>
            To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <h2>5. Disclaimers</h2>
          <p>
            The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
          </p>
          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall Stock OS, its affiliates, or their respective directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
          </p>
          <h2>7. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
          <p className="mt-8">
            <Link to="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Back to Home
              </Button>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;