import React from 'react';
import { Download, Shield, Terminal } from 'lucide-react';

export function DownloadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Download System Optimizer
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Shield className="mr-2" /> Instructions
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            <li>Download the PowerShell script using the button below</li>
            <li>Right-click the downloaded file and select "Run with PowerShell"</li>
            <li>If prompted by Windows Security, click "Run anyway" (the script is safe)</li>
            <li>For best results, run as administrator (right-click PowerShell, select "Run as administrator")</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Terminal className="mr-2" /> Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Disk cleanup and optimization</li>
            <li>Temporary file cleanup</li>
            <li>Windows cache cleanup</li>
            <li>DNS cache cleanup</li>
            <li>Safe and secure execution</li>
            <li>Progress feedback and error handling</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <a
            href="/scripts/optimize-system.ps1"
            download
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all"
          >
            <Download className="mr-2" />
            Download Optimizer Script
          </a>
        </div>

        <p className="text-center text-gray-400 mt-8">
          Note: This script is open source and you can view its contents before running.
          It only performs safe system optimization operations.
        </p>
      </div>
    </div>
  );
}
