"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-950 text-white p-6">
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 border border-gray-700 shadow-lg mt-10">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-400">Privacy Policy for StockOS</CardTitle>
          <p className="text-gray-400 text-sm">Effective Date: October 5, 2025</p>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none text-gray-300">
          <p>
            StockOS (“we”, “our”, or “us”) is committed to protecting your privacy and ensuring transparency about how your personal information is collected, used, and shared. This Privacy Policy explains our practices regarding the data you provide when using our website, applications, and services (collectively, the “Services”).
          </p>
          <p>
            By using StockOS, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use our Services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information from you:</p>
          <h3>a. Personal Information</h3>
          <ul>
            <li>Name, email address, username, and password (when you register an account).</li>
            <li>Payment information (if applicable) for subscriptions or purchases.</li>
            <li>Profile information you provide voluntarily.</li>
          </ul>
          <h3>b. Usage Data</h3>
          <ul>
            <li>Log information such as IP address, browser type, operating system, device information, and pages visited.</li>
            <li>Analytics data on how you use the Services, including clicks, interactions, and feature usage.</li>
          </ul>
          <h3>c. Financial / Stock Data</h3>
          <ul>
            <li>Watchlists, portfolio information, and stock-related preferences that you enter.</li>
            <li>Data collected via integrated APIs for real-time market information (e.g., Alpha Vantage, Finnhub).</li>
          </ul>
          <h3>d. Cookies and Tracking</h3>
          <ul>
            <li>Cookies and similar technologies to remember preferences, improve functionality, and measure usage.</li>
            <li>Google Analytics or equivalent services for anonymous analytics.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Provide, maintain, and improve the Services.</li>
            <li>Personalize your experience and tailor recommendations.</li>
            <li>Process payments and manage subscriptions.</li>
            <li>Send notifications, updates, and promotional content (if you opted in).</li>
            <li>Monitor and analyze usage to improve performance and security.</li>
            <li>Comply with legal obligations and prevent fraudulent activity.</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We respect your privacy and only share information under limited circumstances:</p>
          <ul>
            <li>Service Providers: Third-party vendors who provide analytics, payment processing, or cloud hosting.</li>
            <li>Legal Requirements: When required by law, court order, or governmental authority.</li>
            <li>Business Transfers: If StockOS undergoes a merger, acquisition, or sale of assets.</li>
            <li>Aggregated / Anonymized Data: We may share anonymized data for research or reporting.</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>4. User Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you.</li>
            <li>Correct or update your information.</li>
            <li>Request deletion of your account and personal data.</li>
            <li>Withdraw consent for certain data processing activities.</li>
            <li>Opt out of marketing communications.</li>
          </ul>
          <p>To exercise these rights, contact us at sriramvatsans@gmail.com.</p>

          <h2>5. Cookies and Tracking</h2>
          <p>We use cookies to enhance your experience, remember preferences, and improve site performance.</p>
          <p>You can manage cookies through your browser settings.</p>
          <p>Third-party services (e.g., analytics) may also place cookies; please refer to their privacy policies.</p>

          <h2>6. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. However, no system is completely secure, and we cannot guarantee absolute security.</p>

          <h2>7. Data Retention</h2>
          <p>We retain your personal information only as long as necessary to provide the Services, comply with legal obligations, resolve disputes, and enforce agreements. Data related to inactive accounts may be anonymized or deleted after a defined period.</p>

          <h2>8. Children’s Privacy</h2>
          <p>StockOS is not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a child, we will take steps to delete it promptly.</p>

          <h2>9. Third-Party Links</h2>
          <p>Our Services may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any personal information.</p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will include the “Effective Date” at the top. We encourage you to review this page periodically for updates.</p>

          <h2>11. Contact Us</h2>
          <p>If you have questions, concerns, or requests regarding your personal data or this Privacy Policy, please contact us at:</p>
          <p>Email: sriramvatsans@gmail.com</p>

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

export default PrivacyPolicy;