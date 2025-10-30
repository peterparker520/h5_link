// API service functions for video details and comments

const API_BASE_URL = '/api';

/**
 * Fetch video details
 * @param {string|number} videoId - The video ID
 * @returns {Promise<Object>} Video details response
 */
export const fetchVideoDetails = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/content/video/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_id: parseInt(videoId)
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

/**
 * Fetch video comments
 * @param {string|number} videoId - The video ID
 * @returns {Promise<Object>} Comments response
 */
export const fetchVideoComments = async (videoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/content/video/comment/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_id: parseInt(videoId)
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video comments:', error);
    throw error;
  }
};

/**
 * Fetch video comments
 * @param {string|number} templateId - The video ID
 * @returns {Promise<Object>} Comments response
 */
export const fetchTemplateCategory = async (templateId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/distribute/template/category_names`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: parseInt(templateId)
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching video comments:', error);
    throw error;
  }
};

/**
 * Fetch both video details and comments
 * @param {string|number} videoId - The video ID
 * @returns {Promise<Object>} Combined data with video details and comments
 */
export const fetchVideoData = async (videoId) => {
  try {
    const [videoDetails, videoComments] = await Promise.all([
      fetchVideoDetails(videoId),
      fetchVideoComments(videoId)
    ]);

    const template_id = videoDetails?.data?.video_info?.video?.template?.id;

    const categoryNames = template_id
      ? await Promise.all([fetchTemplateCategory(template_id)])
      : [{ data: {} }]; // 让结构一致

    return {
      videoDetails,
      videoComments,
      categoryNames
    };
  } catch (error) {
    console.error('Error fetching video data:', error);
    throw error;
  }
};
