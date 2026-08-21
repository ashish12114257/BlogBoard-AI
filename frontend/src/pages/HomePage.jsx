import HeroSection from '../components/layout/HeroSection';
import CategoryNav from '../components/layout/CategoryNav';
import SectionHeader from '../components/common/SectionHeader';
import CategoryCard from '../components/blog/CategoryCard';
import FeatureCard from '../components/blog/FeatureCard';
import BlogCard from '../components/blog/BlogCard';
import BlogGrid from '../components/blog/BlogGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import {
  useCategories,
  useFeaturedArticles,
  useRecentArticles,
  useCategoryCounts,
} from '../hooks/useAsync';

export default function HomePage() {
  const { data: categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: featured, loading: featuredLoading, error: featuredError } = useFeaturedArticles(3);
  const { data: recent, loading: recentLoading, error: recentError } = useRecentArticles(6);
  const { data: counts, loading: countsLoading, error: countsError } = useCategoryCounts();

  const [lead, ...restFeatured] = featured || [];

  return (
    <div>
      <HeroSection />

      {/* Editorial category rail — real categories from the API */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-4">
          <CategoryNav
            categories={categories || []}
            loading={categoriesLoading}
            hrefFor={(slug) => `/category/${slug}`}
          />
        </div>
      </div>

      <div className="container-page">
        {/* Featured */}
        <section className="py-12 sm:py-16">
          <SectionHeader
            title="Featured"
            description="Hand-picked reading from across BlogBoard."
            actionTo="/blogs"
          />
          {featuredLoading ? (
            <LoadingSpinner label="Loading featured articles…" />
          ) : featuredError ? (
            <ErrorMessage message={featuredError.message} />
          ) : !featured || featured.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No featured articles yet"
                message="Featured articles will appear here."
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <FeatureCard article={lead} />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {restFeatured.map((article) => (
                  <BlogCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="border-t border-slate-200 py-12 sm:py-16">
          <SectionHeader
            title="Browse by category"
            description="Every article is organized under a focused topic."
          />
          {categoriesLoading || countsLoading ? (
            <LoadingSpinner label="Loading categories…" />
          ) : categoriesError || countsError ? (
            <ErrorMessage message={(categoriesError || countsError).message} />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  count={counts[category.slug] || 0}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent */}
        <section className="border-t border-slate-200 py-12 sm:py-16">
          <SectionHeader
            title="Latest articles"
            description="Freshly published on BlogBoard."
            actionTo="/blogs"
          />
          {recentLoading ? (
            <LoadingSpinner label="Loading recent articles…" />
          ) : recentError ? (
            <ErrorMessage message={recentError.message} />
          ) : recent.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No articles published yet"
                message="Check back soon."
              />
            </div>
          ) : (
            <BlogGrid articles={recent} columns={3} className="mt-8" />
          )}
        </section>
      </div>
    </div>
  );
}
