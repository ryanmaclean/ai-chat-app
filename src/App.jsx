import React, { useState, useEffect } from 'react'
import copy from 'copy-to-clipboard'
import MarkdownRenderer from './components/MarkdownRenderer'
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard'
import ChatHistory from './components/chat/ChatHistory'
import ChatHeader from './components/chat/ChatHeader'
import { signInWithSupabase, getSession } from './supabase'
import ChatContainer from './components/chat/ChatContainer'
import ThemeModal from './components/theme/ThemeModal'
import { ThemeProvider } from './components/theme/ThemeProvider'
import './index.css'
import ChatMessage from './components/chat/ChatMessage'
import ChatInput from './components/chat/ChatInput'
import { getModels } from './api/models'

function App() {
  const defaultModel = 'gpt-3.5-turbo'
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [model, setModel] = useState(defaultModel)
  const [modelOptions, setModelOptions] = useState([])
  const [isModelsLoading, setIsModelsLoading] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [copiedFull, setCopiedFull] = useState(false)
  const [responseTime, setResponseTime] = useState(null)
  const [session, setSession] = useState(null)
  const [modelsList, setModelsList] = useState([])
  const [activeTab, setActiveTab] = useState('chat')
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  
  // Token and cost tracking
  const [sentTokenCount, setSentTokenCount] = useState(0)
  const [receivedTokenCount, setReceivedTokenCount] = useState(0)
  const [approximateCost, setApproximateCost] = useState(0)
  const [totalTokenCount, setTotalTokenCount] = useState(0)

  // State for analytics
  const [analyticsData, setAnalyticsData] = useState({
    tokenUsage: [],
    costData: [],
    responseTimeData: [],
    modelUsage: {}
  })

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch the user session on mount
  useEffect(() => {
    async function fetchSession() {
      const sess = await getSession()
      setSession(sess)
    }
    fetchSession()
  }, [])

  // Once session is available, fetch the models once to get a static list.
  useEffect(() => {
    async function fetchModels() {
      setIsModelsLoading(true)
      try {
        // Use the simple API function instead of fetch
        const data = await getModels()
        
        if (data && data.data && Array.isArray(data.data)) {
          setModelOptions(data.data.map(model => model.id))
        } else {
          throw new Error('Unexpected data format from API')
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        // Fallback to default models
        setModelOptions(['gpt-3.5-turbo', 'gpt-4'])
      } finally {
        setIsModelsLoading(false)
      }
    }
    if (session) {
      fetchModels()
    }
  }, [session])

  const handleLogin = async () => {
    try {
      const res = await signInWithSupabase()
      setSession(res)
    } catch (error) {
      console.error('handleLogin: error during login', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return

    setLoading(true)
    setResult('')
    setResponseTime(null)

    const startTime = Date.now()

    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      if (data.error) {
        setResult(`Error: ${data.error.message || JSON.stringify(data.error)}`)
      } else {
        setResult(data.choices[0].message.content)
        
        // Update token counts and cost
        setSentTokenCount(data.usage.prompt_tokens)
        setReceivedTokenCount(data.usage.completion_tokens)
        setTotalTokenCount(data.usage.total_tokens)
        
        // Calculate approximate cost
        // These rates are approximations and may change
        const inputCost = data.usage.prompt_tokens * 0.0000015
        const outputCost = data.usage.completion_tokens * 0.000002
        setApproximateCost(inputCost + outputCost)
        
        // Update the conversation in state
        if (activeConversationId) {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === activeConversationId 
                ? { 
                    ...conv, 
                    messages: [
                      ...conv.messages, 
                      { role: 'user', content: prompt },
                      { role: 'assistant', content: data.choices[0].message.content }
                    ],
                    updatedAt: new Date().toISOString() 
                  } 
                : conv
            )
          )
        } else {
          // Create a new conversation if none is active
          handleNewChat()
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyFull = () => {
    copy(result)
    setCopiedFull(true)
    setTimeout(() => setCopiedFull(false), 2000)
  }

  const handleListModels = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API_URL}/api/list-models`)
      const data = await response.json()
      setModelsList(data.data)
    } catch (error) {
      console.error('Error listing models:', error)
      setModelsList([{ id: 'Error fetching models' }])
    }
  }

  // Mock function to create a new conversation
  const handleNewChat = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setActiveConversationId(newConversation.id)
    setPrompt('')
    setResult('')
  }

  // Function to handle conversation selection
  const handleSelectConversation = (id) => {
    setActiveConversationId(id)
    // In a real app, you would load the conversation messages here
  }

  // Function to handle conversation deletion
  const handleDeleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (activeConversationId === id) {
      setActiveConversationId(conversations.length > 1 ? conversations[0].id : null)
      setPrompt('')
      setResult('')
    }
  }

  // Function to handle conversation title change
  const handleTitleChange = (newTitle) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, title: newTitle, updatedAt: new Date().toISOString() } 
          : conv
      )
    )
  }

  // Function to export the current conversation
  const handleExportChat = () => {
    const currentConversation = conversations.find(conv => conv.id === activeConversationId)
    if (!currentConversation) return
    
    const exportData = {
      title: currentConversation.title,
      model: model,
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: result }
      ],
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentConversation.title.replace(/\s+/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Get the active conversation
  const activeConversation = conversations.find(conv => conv.id === activeConversationId) || {
    title: 'New Conversation',
    messages: []
  }

  // Show loading screen until models are loaded
  if (session && isModelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card w-full max-w-sm p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Loading Models...</h2>
        </div>
      </div>
    )
  }

  // If not logged in, display login prompt
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card w-full max-w-sm p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <button
            onClick={handleLogin}
            className="btn-submit text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  // Update analytics data
  const handleUpdateAnalytics = (data) => {
    const { model, inputTokens, outputTokens, cost, responseTime } = data;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    setAnalyticsData(prev => {
      // Update token usage
      const tokenUsageIndex = prev.tokenUsage.findIndex(item => item.date === today);
      const updatedTokenUsage = [...prev.tokenUsage];
      
      if (tokenUsageIndex >= 0) {
        updatedTokenUsage[tokenUsageIndex] = {
          ...updatedTokenUsage[tokenUsageIndex],
          input: updatedTokenUsage[tokenUsageIndex].input + inputTokens,
          output: updatedTokenUsage[tokenUsageIndex].output + outputTokens
        };
      } else {
        updatedTokenUsage.push({ date: today, input: inputTokens, output: outputTokens });
      }
      
      // Update cost data
      const costIndex = prev.costData.findIndex(item => item.date === today);
      const updatedCostData = [...prev.costData];
      
      if (costIndex >= 0) {
        updatedCostData[costIndex] = {
          ...updatedCostData[costIndex],
          cost: updatedCostData[costIndex].cost + cost
        };
      } else {
        updatedCostData.push({ date: today, cost });
      }
      
      // Update response time data
      const updatedResponseTimeData = [
        ...prev.responseTimeData,
        { timestamp, time: responseTime }
      ].slice(-20); // Keep only the last 20 entries
      
      // Update model usage
      const updatedModelUsage = { ...prev.modelUsage };
      updatedModelUsage[model] = (updatedModelUsage[model] || 0) + 1;
      
      return {
        tokenUsage: updatedTokenUsage,
        costData: updatedCostData,
        responseTimeData: updatedResponseTimeData,
        modelUsage: updatedModelUsage
      };
    });
  };

  const handleSendMessage = async (message) => {
    // Add user message to the chat
    const newMessages = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call the OpenAI API
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: message }],
          temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.choices[0].message.content }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to a mock response if the API call fails
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: `I'm sorry, I couldn't process your request. Please try again later.` 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Chat Application</h1>
          <p className="text-gray-400">
            Interact with AI models and track usage analytics
          </p>
        </header>

        <div className="mb-6 glass-card p-2 inline-flex rounded-md">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'chat' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'chat' ? (
          <div>
            <ChatContainer
              model={model}
              temperature={temperature}
              onUpdateAnalytics={handleUpdateAnalytics}
            />
            
            <div className="mt-4 glass-card p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <label htmlFor="temperature" className="text-sm">
                    Temperature: {temperature}
                  </label>
                  <input
                    type="range"
                    id="temperature"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-24"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <label htmlFor="model" className="text-sm">Model:</label>
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md p-1 text-sm"
                    disabled={isModelsLoading}
                  >
                    {modelOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AnalyticsDashboard data={analyticsData} />
        )}
        
        <ThemeModal />
      </div>
    </ThemeProvider>
  )
}

export default App
