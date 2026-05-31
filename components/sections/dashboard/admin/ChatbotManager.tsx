'use client'

import { useState, useEffect } from 'react'
import { useQuery, useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  RefreshCw,
  Trash2,
  Bot,
  Globe,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
} from 'lucide-react'
import { toast } from 'react-toastify'

export default function ChatbotManager() {
  const [isReindexing, setIsReindexing] = useState(false)
  const [isCleaning, setIsCleaning] = useState(false)
  const [cleanupResult, setCleanupResult] = useState<{
    messagesDeleted: number
    sessionsDeleted: number
  } | null>(null)

  const stats = useQuery(api.websiteIndexer.getStoredContentStats)
  const logs = useQuery(api.websiteIndexer.getIndexingStatus)

  const reindex = useAction(api.websiteIndexer.manualReindexWebsite)
  const cleanup = useAction(api.chatbot.runCleanup)
  const createSession = useMutation(api.chatbot.createChatSession)

  useEffect(() => {
    createSession({ sessionId: 'admin-health-check' })
  }, [createSession])

  const handleReindex = async () => {
    setIsReindexing(true)
    try {
      const result = await reindex()
      toast.success(
        `Indexed ${result.pagesIndexed} pages, created ${result.chunksCreated} chunks, deleted ${result.chunksDeleted} chunks.`,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Re-indexing failed'
      toast.error(message)
    } finally {
      setIsReindexing(false)
    }
  }

  const handleCleanup = async () => {
    setIsCleaning(true)
    try {
      const result = await cleanup()
      setCleanupResult(result)
      toast.success(
        `Cleaned up: ${result.messagesDeleted} messages, ${result.sessionsDeleted} sessions.`,
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Cleanup failed'
      toast.error(message)
    } finally {
      setIsCleaning(false)
    }
  }

  const statusBadge = (status: string | null | undefined) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Success
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      case 'running':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Running
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-500">
            N/A
          </Badge>
        )
    }
  }

  const latestLog = logs?.[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Content Chunks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.totalChunks ?? '-'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              from {stats?.totalPages ?? '-'} pages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Last Indexed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-900">
              {stats?.lastIndexed
                ? new Date(stats.lastIndexed).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Never'}
            </p>
            <div className="mt-2">{statusBadge(stats?.lastStatus)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Chat Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-900">
              Cleanup runs daily at 03:00 UTC
            </p>
            {cleanupResult && (
              <p className="text-xs text-gray-500 mt-1">
                Last cleanup: {cleanupResult.messagesDeleted} messages,{' '}
                {cleanupResult.sessionsDeleted} sessions
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Website Indexing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Crawl Sozim website pages, extract clean text, and store as searchable chunks.
              Unchanged content is preserved — only new, changed, or removed pages are
              updated.
            </p>
            <Button
              onClick={handleReindex}
              disabled={isReindexing}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              {isReindexing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Indexing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-index Website
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Chat Cleanup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Delete expired chat sessions and messages older than 30 days. This runs
              automatically every day but you can also run it manually.
            </p>
            <Button
              onClick={handleCleanup}
              disabled={isCleaning}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            >
              {isCleaning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cleaning...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Run Cleanup Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {latestLog && (
        <Card className="bg-white/70 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Latest Indexing Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span>{statusBadge(latestLog.status)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Started</span>
                <span className="font-medium">
                  {new Date(latestLog.startedAt).toLocaleString('en-ZA')}
                </span>
              </div>
              {latestLog.finishedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Finished</span>
                  <span className="font-medium">
                    {new Date(latestLog.finishedAt).toLocaleString('en-ZA')}
                  </span>
                </div>
              )}
              {latestLog.pagesIndexed !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Pages Indexed</span>
                  <span className="font-medium">{latestLog.pagesIndexed}</span>
                </div>
              )}
              {latestLog.chunksCreated !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Chunks Created</span>
                  <span className="font-medium">{latestLog.chunksCreated}</span>
                </div>
              )}
              {latestLog.chunksDeleted !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Chunks Deleted</span>
                  <span className="font-medium">{latestLog.chunksDeleted}</span>
                </div>
              )}
              {latestLog.error && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Error</span>
                  <span className="font-medium text-red-600 max-w-[250px] truncate" title={latestLog.error}>
                    {latestLog.error}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
