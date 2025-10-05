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
          <CardTitle className="text-3xl font-bold text-green-400">Privacy Policy for Stock OS</CardTitle>
          <p className="text-gray-400 text-sm">Effective Date: October 5, 2025</p>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none text-gray-300">
          <p>
            Stock OS ("we", "our", or "us") is committed to protecting your privacy and ensuring transparency about how your personal information is collected, used, and shared. This Privacy Policy explains our practices regarding the data you provide when using our website, applications, and services (collectively, the "Services").
          </p>
          <p>
            By accessing or using Stock OS, you agree to the practices described in this Privacy Policy. If you do not agree, please do not use our Services.
          </p>

          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information from you:</p>
          <h3>a. Personal Information</h3>
          <ul>
            <li><strong>Account Information:</strong> When you register for an account, we collect your name, email address, username, and password.</li>
            <li><strong>Profile Data:</strong> Any additional information you choose to provide for your user profile, such as an avatar URL.</li>
            <li><strong>Payment Information:</strong> If you subscribe to paid services, we collect necessary payment details (processed securely by third-party payment processors).</li>
          </ul>
          <h3>b. Usage Data</h3>
          <ul>
            <li><strong>Log Data:</strong> Information automatically collected when you access and use the Services, including your IP address, browser type, operating system, device information, and pages visited.</li>
            <li><strong>Analytics Data:</strong> Data on how you interact with the Services, such as clicks, feature usage, and time spent on pages, to help us understand and improve user experience.</li>
          </ul>
          <h3>c. Trading and Financial Data</h3>
          <ul>
            <li><strong>Portfolio Information:</strong> Details of your simulated stock portfolio, including holdings, quantities, and cash balance.</li>
            <li><strong>Watchlists and Preferences:</strong> Any stocks you add to watchlists or other trading preferences you set.</li>
            <li><strong>Market Data:</strong> While we display real-time market information, we do not store your personal real-time market data from external APIs beyond what is necessary for your session or simulated portfolio.</li>
          </ul>
          <h3>d. Cookies and Tracking Technologies</h3>
          <ul>
            <li>We use cookies and similar tracking technologies (like local storage) to remember your preferences, maintain your session, improve functionality, and analyze Service usage.</li>
            <li>These technologies help us provide a more personalized and efficient experience.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information for various purposes, including:</p>
          <ul>
            <li><strong>To Provide and Maintain Services:</strong> Operating, maintaining, and improving the functionality of Stock OS, including your simulated trading environment.</li>
            <li><strong>Personalization:</strong> Customizing your experience, such as displaying relevant stock data or news, and tailoring recommendations.</li>
            <li><strong>Account Management:</strong> Processing payments, managing subscriptions, and facilitating authentication.</li>
            <li><strong>Communication:</strong> Sending you important notifications, updates, and, if you opt-in, promotional content.</li>
            <li><strong>Analytics and Improvement:</strong> Monitoring and analyzing usage patterns to diagnose technical issues, improve performance, and develop new features.</li>
            <li><strong>Security and Compliance:</strong> Protecting against fraudulent or unauthorized activity, and complying with legal obligations.</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>We respect your privacy and only share your information under specific, limited circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We may share data with trusted third-party vendors who perform services on our behalf, such as cloud hosting, analytics, and payment processing. These providers are obligated to protect your information.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental authority, or if we believe such action is necessary to comply with legal processes, protect our rights or property, or ensure the safety of our users or the public.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.</li>
            <li><strong>Aggregated / Anonymized Data:</strong> We may share aggregated or anonymized data that cannot be used to identify you personally for research, marketing, or reporting purposes.</li>
          </ul>
          <p><strong>We do not sell your personal information to third parties.</strong></p>

          <h2>4. Your Data Rights</h2>
          <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> Request that we correct or update any inaccurate or incomplete personal information.</li>
            <li><strong>Deletion:</strong> Request the deletion of your account and personal data, subject to certain legal obligations.</li>
            <li><strong>Withdraw Consent:</strong> Withdraw your consent for certain data processing activities, where consent was the legal basis for processing.</li>
            <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time.</li>
          </ul>
          <p>To exercise these rights, please contact us using the details provided in Section 11.</p>

          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. This includes encryption, access controls, and secure software development practices. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>6. Data Retention</h2>
          <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, to provide our Services, comply with legal obligations, resolve disputes, and enforce our agreements. Data related to inactive accounts may be anonymized or deleted after a defined period, in accordance with our data retention policies.</p>

          <h2>7. Children’s Privacy</h2>
          <p>Stock OS is not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a child under 13, we will take immediate steps to delete that information from our records.</p>

          <h2>8. Third-Party Links</h2>
          <p>Our Services may contain links to third-party websites or applications. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

          <h2>9. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or new features. The updated version will include the "Effective Date" at the top of the policy. We will notify you of any significant changes by posting the new Privacy Policy on this page or through other appropriate communication channels. Your continued use of the Services after any such changes constitutes your acceptance of the revised Privacy Policy.</p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding your personal data or this Privacy Policy, please contact us at:</p>
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