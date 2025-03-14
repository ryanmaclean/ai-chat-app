import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import ChatInterface from './components/chat/ChatInterface';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { ThemeToggle } from './components/theme/ThemeToggle';
import './styles/globals.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <ThemeProvider>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to content
      </a>
      <div id="main-content" className="container mx-auto py-8 px-4 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Chat Application</h1>
          <p className="text-gray-400 dark:text-gray-300">
            Interact with AI models and track usage analytics
          </p>
        </header>

        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass-morphism mb-8">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0">
            <ChatInterface />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <AnalyticsDashboard data={{
              tokenUsage: [],
              costData: [],
              responseTimeData: [],
              modelUsage: {}
            }} />
          </TabsContent>
        </Tabs>
        
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
};

export default App; 