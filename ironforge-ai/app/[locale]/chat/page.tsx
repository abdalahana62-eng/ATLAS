'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Loader2,
  MoreVertical,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const activeModel = process.env.NEXT_PUBLIC_OPENAI_MODEL || 'openai/gpt-oss-20b';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: locale === 'ar' 
        ? 'مرحباً! أنا مدربك الذكي لكمال الأجسام. كيف يمكنني مساعدتك اليوم في رحلتك الرياضية؟'
        : 'Hello! I\'m your AI bodybuilding coach. How can I help you today on your fitness journey?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    locale === 'ar' ? 'خطة تمرين لهذا الأسبوع' : 'Workout plan for this week',
    locale === 'ar' ? 'إرشادات تغذية اليوم' : 'Nutrition guidance for today',
    locale === 'ar' ? 'كيف أزيد كتلة عضلية؟' : 'How can I build muscle faster?',
    locale === 'ar' ? 'ماذا أتناول بعد التمرين؟' : 'What should I eat after training?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // في الـ APK الأوفلاين الـ API لازم يجي من Vercel مباشرة (سحابي Groq)
      const isCapacitor = typeof window !== 'undefined' && window.location.protocol === 'capacitor:';
      const vercelBase = process.env.NEXT_PUBLIC_VERCEL_URL 
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
        : 'https://atlas2-ochre.vercel.app';
      const apiUrl = isCapacitor
        ? `${vercelBase}/api/chat`
        : '/api/chat';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to get AI response');
      }

      if (!response.body) {
        throw new Error('No response body available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const messages = chunk.split('\n\n');

        for (const rawMessage of messages) {
          const trimmed = rawMessage.trim();
          if (!trimmed.startsWith('data:')) continue;

          const payload = trimmed.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;

          try {
            const parsed = JSON.parse(payload);
            const nextContent = parsed?.content ?? '';

            if (!nextContent) continue;

            streamedText += nextContent;
            setMessages(prev => prev.map(msg =>
              msg.id === assistantId
                ? { ...msg, content: streamedText }
                : msg
            ));
          } catch {
            // Ignore malformed SSE payloads and keep streaming.
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: locale === 'ar'
          ? 'عذراً، حدث خطأ في اتصال النموذج. يرجى المحاولة مرة أخرى.'
          : 'Sorry, the model connection failed. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg =>
        msg.id === assistantId
          ? errorMessage
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      const inputElement = document.getElementById('chat-input') as HTMLInputElement | null;
      inputElement?.focus();
    }, 0);
  };

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: locale === 'ar' 
          ? 'مرحباً! أنا مدربك الذكي لكمال الأجسام. كيف يمكنني مساعدتك اليوم في رحلتك الرياضية؟'
          : 'Hello! I\'m your AI bodybuilding coach. How can I help you today on your fitness journey?',
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-ironforge-background flex flex-col">
      {/* Header */}
      <div className="border-b border-ironforge-border bg-ironforge-card p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ironforge-primary/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-ironforge-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-ironforge-text">
                {t('title')}
              </h1>
              <p className="text-sm text-ironforge-text-muted">
                {locale === 'ar' ? 'مدربك الذكي الشخصي' : 'Your Personal AI Coach'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="border border-ironforge-primary/50 bg-ironforge-primary/10 text-ironforge-primary text-[10px] font-medium uppercase tracking-wide">
              {activeModel}
            </Badge>
          </div>
          
          <Button
            onClick={clearChat}
            variant="outline"
            size="sm"
            className="border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
          >
            <Trash2 className="w-4 h-4 ml-2" />
            {locale === 'ar' ? 'مسح' : 'Clear'}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-ironforge-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-ironforge-primary" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <Card 
                  className={`p-4 ${
                    message.role === 'user'
                      ? 'bg-ironforge-primary text-ironforge-background border-ironforge-primary'
                      : 'bg-ironforge-card text-ironforge-text border-ironforge-border'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </Card>
                
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-xs text-ironforge-text-muted">
                    {formatTime(message.timestamp)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="text-xs text-ironforge-text-muted hover:text-ironforge-primary transition-colors"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-ironforge-primary flex items-center justify-center flex-shrink-0 order-1">
                  <User className="w-4 h-4 text-ironforge-background" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-ironforge-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-ironforge-primary" />
              </div>
              
              <Card className="p-4 bg-ironforge-card text-ironforge-text border-ironforge-border">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-ironforge-primary" />
                  <span className="text-sm text-ironforge-text-muted">
                    {t('typing')}
                  </span>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-ironforge-border bg-ironforge-card p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('placeholder')}
              disabled={isLoading}
              className={`flex-1 bg-ironforge-background border-ironforge-border text-ironforge-text placeholder-ironforge-text-muted focus:border-ironforge-primary ${isRTL ? 'text-right' : 'text-left'}`}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <Badge
                key={prompt}
                variant="outline"
                onClick={() => handleQuickPrompt(prompt)}
                className="cursor-pointer border-ironforge-border bg-ironforge-card/70 text-xs text-ironforge-text-muted transition-colors hover:border-ironforge-primary hover:text-ironforge-primary"
              >
                {prompt}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}