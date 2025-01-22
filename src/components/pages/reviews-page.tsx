'use client'

import Link from 'next/link'
import { useReviews } from '@/hooks/useReviews'
import { Separator } from '@/components/ui/separator'
import ReviewItem from '@/components/reviews/review-item'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { useState } from 'react'
import ReviewForm from '@/components/reviews/reivew-form'
import { Button } from '@/components/ui/button'
import { PiPencilSimpleLineFill } from 'react-icons/pi'
import { IReview } from '@/types/reviews'

interface ReviewsPageProps {
  preview?: boolean
  poolId: string
}

export default function ReviewsPage({
  preview = false,
  poolId,
}: ReviewsPageProps) {
  const { data, isLoading, isError, createReview, updateReview, deleteReview } =
    useReviews({ poolId })
  const [isWriteOpen, setIsWriteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null)

  const handleEdit = (review: IReview) => {
    setSelectedReview(review)
    setIsEditOpen(true)
  }

  //TODO : 로딩중과 에러발생시 UI를 개선합니다.
  if (isLoading) {
    return <div>로딩 중...</div>
  }

  if (isError) {
    return <div>에러가 발생했습니다.</div>
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>
  }

  return (
    <section className="flex flex-col space-y-4">
      <ResponsiveDialog
        isOpen={isWriteOpen}
        setIsOpen={setIsWriteOpen}
        title="수영장 리뷰를 남겨주세요"
        description="여러분들의 소중한 리뷰는 다른 사용자들에게 큰 도움이 됩니다."
      >
        <ReviewForm
          poolId={poolId}
          onSubmit={createReview}
          setIsOpen={setIsWriteOpen}
        />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="리뷰 수정하기"
        description="여러분들의 소중한 리뷰는 다른 사용자들에게 큰 도움이 됩니다."
      >
        <ReviewForm
          poolId={poolId}
          onSubmit={updateReview}
          setIsOpen={setIsEditOpen}
          defaultValues={
            selectedReview
              ? {
                  keywords: selectedReview.keywords,
                  content: selectedReview.content,
                }
              : undefined
          }
        />
      </ResponsiveDialog>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          수영장 리뷰<span className="ml-2 text-gray-500">{data.total}</span>
        </h2>

        <Button
          variant="ghost"
          onClick={() => setIsWriteOpen(true)}
          className="rounded-full"
        >
          <PiPencilSimpleLineFill className="text-blue-500" />
          리뷰 작성하기
        </Button>
      </div>
      <Separator />
      {Object.entries(data.summary).map(([keyword, count]) => (
        <div key={keyword} className="rounded-md bg-gray-100 p-4">
          {keyword}: {count}
        </div>
      ))}
      <Separator />
      <div className="flex flex-col divide-y-0 rounded-md bg-gray-100 p-2">
        {data.reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            poolId={poolId}
            deleteReview={deleteReview}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {preview && (
        <Link href={`/pools/${poolId}/reviews`} className="mx-auto">
          <Button variant="primary" className="rounded-full">
            리뷰 더보기
          </Button>
        </Link>
      )}
      {/* TODO : 프리뷰 상태가 아닌경우 무한스크롤을 활성화합니다. */}
    </section>
  )
}
