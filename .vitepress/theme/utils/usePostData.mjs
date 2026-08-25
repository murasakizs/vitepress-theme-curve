import { computed, ref } from "vue";
import { useData } from "vitepress";

const postData = ref([]);
const isLoading = ref(false);
let loadPromise = null;

const normalizeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const groupByField = (posts, field) => {
  const grouped = {};

  posts.forEach((post) => {
    normalizeList(post[field]).forEach((name) => {
      if (!grouped[name]) {
        grouped[name] = {
          count: 0,
          articles: [],
        };
      }
      grouped[name].count++;
      grouped[name].articles.push(post);
    });
  });

  return grouped;
};

const groupByYear = (posts) => {
  const archiveData = {};

  posts.forEach((post) => {
    if (!post.date) return;

    const year = new Date(post.date).getFullYear().toString();
    if (!archiveData[year]) {
      archiveData[year] = {
        count: 0,
        articles: [],
      };
    }
    archiveData[year].count++;
    archiveData[year].articles.push(post);
  });

  const sortedYears = Object.keys(archiveData).sort((a, b) => parseInt(b) - parseInt(a));
  return { data: archiveData, year: sortedYears };
};

export const usePostData = () => {
  const { site } = useData();

  const loadPostData = async () => {
    if (postData.value.length) return postData.value;
    if (loadPromise) return loadPromise;

    isLoading.value = true;
    const base = site.value?.base || "/";
    const url = `${base.replace(/\/$/, "")}/data/postData.json`;

    loadPromise = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`加载文章索引失败：${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        postData.value = Array.isArray(data) ? data : [];
        return postData.value;
      })
      .catch((error) => {
        console.error(error);
        postData.value = [];
        return postData.value;
      })
      .finally(() => {
        isLoading.value = false;
        loadPromise = null;
      });

    return loadPromise;
  };

  return {
    postData,
    postCount: computed(() => postData.value.length),
    tagsData: computed(() => groupByField(postData.value, "tags")),
    categoriesData: computed(() => groupByField(postData.value, "categories")),
    archivesData: computed(() => groupByYear(postData.value)),
    isLoading,
    loadPostData,
  };
};
