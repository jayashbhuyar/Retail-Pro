import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, ArrowRight, Globe, Loader, Moon, Sun, Search } from 'lucide-react';

const NewsFeed = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8000/api/news/top-headlines',{
          withCredentials:true
        });
        
        console.log('API Response:', response.data); // Debug log

        if (response.data) {
          let processedNews;
          if (Array.isArray(response.data)) {
            processedNews = {
              status: 'ok',
              totalResults: response.data.length,
              articles: response.data
            };
          } else if (typeof response.data === 'object' && Array.isArray(response.data.articles)) {
            processedNews = {
              status: response.data.status || 'ok',
              totalResults: response.data.totalResults || response.data.articles.length,
              articles: response.data.articles
            };
          } else {
            throw new Error('Unexpected response structure');
          }
          setNews(processedNews);
        } else {
          throw new Error('No data in response');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(`Error fetching news: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredArticles = news?.articles?.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Today's Top News</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'}`}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="mb-6 flex items-center">
          <Search className="h-5 w-5 mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          />
        </div>

        {error ? (
          <div className={`border-l-4 p-4 m-4 ${darkMode ? 'bg-red-900 border-red-500 text-red-200' : 'bg-red-100 border-red-500 text-red-700'}`} role="alert">
            <div className="flex">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            <p className="text-center mb-6">Total Results: {filteredArticles.length}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <div key={index} className={`rounded-xl shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {article.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline font-bold flex items-center"
                      >
                        Read more <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                      {article.source && article.source.name && (
                        <div className="flex items-center text-gray-500">
                          <Globe className="h-4 w-4 mr-1" />
                          <span>{article.source.name}</span>
                        </div>
                      )}
                    </div>
                    {article.publishedAt && (
                      <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(article.publishedAt).toLocaleString()}
                      </p>
                    )}
                    {article.author && (
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        By: {article.author}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={`border-l-4 p-4 m-4 ${darkMode ? 'bg-yellow-900 border-yellow-500 text-yellow-200' : 'bg-yellow-100 border-yellow-500 text-yellow-700'}`} role="alert">
            <div className="flex">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>No news available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;