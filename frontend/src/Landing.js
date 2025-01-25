import React from 'react';
import { MessageSquare, Layout, Zap, Users, ArrowRight } from 'lucide-react';
import Header from './components/header';
import Login from './Login';

function Landing() {
  return (
    <main>
      <div>
        <Header className="pt-16"/>
      </div>
      {/* Hero */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Where Communication Meets{' '}
              <span className="text-indigo-600">Project Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Clack combines the best of team chat and project management. The only tool for all of your business needs.
            </p>
            <div className="flex justify-center">
              <a
                href="/signup"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Chat</h3>
              <p className="text-gray-600">
                Real-time messaging with organized channels and direct messages.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kanban Boards</h3>
              <p className="text-gray-600">
                Visual project management with customizable workflows.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seamless Integration</h3>
              <p className="text-gray-600">
                Chat and tasks work together for maximum productivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Landing;
