import ProductsGrid from '@/components/sections/store/ProductsGrid'
import PageHeader from '@/components/global/PageHeader'

export default function Shop() {
  return (
    <>
      <PageHeader
        title="Sozim Store"
        details="Discover premium products crafted for comfort, quality, and everyday living. Shop with confidence and enjoy a seamless shopping experience."
      />
      <ProductsGrid />
    </>
  )
}
