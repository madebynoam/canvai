export interface CommentAuthor {
  login: string
  avatarUrl: string
  name?: string
}

export interface CommentReaction {
  emoji: string
  count: number
  viewerHasReacted: boolean
  reactionIds?: number[]  // GitHub reaction IDs for the viewer (used for removal)
}

export interface CommentMessage {
  id: string                    // "issue-{number}" for original, "comment-{id}" for replies
  ghCommentId?: number          // GitHub comment ID (for replies only, used for reactions)
  author: CommentAuthor
  body: string
  reactions: CommentReaction[]
  createdAt: string             // ISO 8601
  isOriginal: boolean           // true for the issue body (first message)
}

export interface CommentThread {
  id: string                    // GitHub Issue number as string
  ghIssueNumber: number
  ghIssueUrl: string
  frameId: string
  componentName: string
  selector: string
  elementTag: string
  elementText: string
  computedStyles: Record<string, string>
  author: CommentAuthor
  messages: CommentMessage[]
  status: 'open' | 'resolved'
  annotationId?: string         // if promoted to annotation
  createdAt: string
  updatedAt: string
}

export interface CommentPin {
  threadId: string
  frameId: string
  selector: string
  author: CommentAuthor
  replyCount: number
  hasAnnotation: boolean
  status: 'open' | 'resolved'
}
