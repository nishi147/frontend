import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://ruzann.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Static routes
  const routes = [
    '',
    '/workshops',
    '/bootcamps',
    '/courses',
    '/payment-success',
    '/login',
    '/signup',
    '/contact',
    '/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic routes
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const [coursesRes, workshopsRes, bootcampsRes] = await Promise.all([
      fetch(`${apiUrl}/api/courses`).then(res => res.json()),
      fetch(`${apiUrl}/api/workshops`).then(res => res.json()),
      fetch(`${apiUrl}/api/bootcamps`).then(res => res.json()),
    ]);

    if (coursesRes.success) {
      dynamicRoutes.push(...coursesRes.data.map((c: any) => ({
        url: `${baseUrl}/courses/${c._id}`,
        lastModified: new Date(c.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })));
    }

    if (workshopsRes.success) {
      dynamicRoutes.push(...workshopsRes.data.map((w: any) => ({
        url: `${baseUrl}/workshops/${w._id}`,
        lastModified: new Date(w.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })));
    }

    if (bootcampsRes.success) {
      dynamicRoutes.push(...bootcampsRes.data.map((b: any) => ({
        url: `${baseUrl}/bootcamps/${b._id}`,
        lastModified: new Date(b.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })));
    }
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
  }
  
  return [...routes, ...dynamicRoutes];
}
