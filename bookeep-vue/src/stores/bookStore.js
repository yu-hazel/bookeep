import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBookStore = defineStore('bookStore', () => {
    const query = ref('');
    const books = ref([]);
    const selectedBook = ref(null);
    const showModal = ref(false);

    const categories = ['읽고 싶은 책', '읽는 중인 책', '다 읽은 책'];
    const selectedCategory = ref(categories[0]);
    const pages = ref('');
    const comment = ref('');
    const startDate = ref('');
    const endDate = ref('');
    const rating = ref(0);

    const selectedSavedBook = ref(null);
    const showSavedBookModal = ref(false);
    const selectedSavedBookCategory = ref('');

    const readingPage = ref('');

    const searchBooks = async () => {
        if (query.value.trim() === '') {
            console.error('검색어를 입력하세요.');
            return;
        }
        try {
            const url = `https://dapi.kakao.com/v3/search/book?target=title&size=50&query=${query.value}`;
            console.log('API 요청 URL:', url);
            const response = await fetch(url, {
                method: 'GET',
                headers: { Authorization: 'KakaoAK bb155ac85c80a7efdc2647ef682e4fb0' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            books.value = data.documents;
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const selectBook = (book) => {
        selectedBook.value = book;
        showModal.value = true;

        // 책 클릭할 때마다 초기화
        pages.value = '';
        readingPage.value = '';
        comment.value = '';
        selectedCategory.value = categories[0];
        startDate.value = '';
        endDate.value = '';
        rating.value = 0;
    };

    const closeModal = () => {
        showModal.value = false;
    };

    const setQuery = (newQuery) => {
        query.value = newQuery;
    };

    const saveBook = () => {
        const categoryKeyMap = {
            '읽고 싶은 책': 'wantToRead',
            '읽는 중인 책': 'reading',
            '다 읽은 책': 'finished',
        };

        let savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };

        const bookData = {
            title: selectedBook.value.title,
            thumbnail: selectedBook.value.thumbnail,
            authors: selectedBook.value.authors,
            isbn: selectedBook.value.isbn,
            pages: pages.value,
            readingPage: readingPage.value,
            comment: comment.value,
            startDate: startDate.value,
            endDate: endDate.value,
            rating: rating.value,
        };

        const bookExists = Object.keys(savedBooks).some(cat => {
            return savedBooks[cat].some(savedBook => savedBook.isbn === bookData.isbn);
        });

        if (!bookExists) {
            savedBooks[categoryKeyMap[selectedCategory.value]].push(bookData);
            localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
            alert('책이 저장되었습니다.');
        } else {
            alert('이미 저장된 책입니다.');
        }

        closeModal();
    };

    const selectSavedBook = (book, category) => {
        selectedSavedBook.value = book;
        showSavedBookModal.value = true;
        selectedSavedBookCategory.value = category;

        if (category === '읽는 중인 책') {
            readingPage.value = book.readingPage || '';
        }
    };

    const closeSavedBookModal = () => {
        showSavedBookModal.value = false;
        selectedSavedBookCategory.value = '';
    };

    const updateSavedBook = (updatedBook, newCategory) => {
        const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };

        const oldCategoryKey = {
            '읽고 싶은 책': 'wantToRead',
            '읽는 중인 책': 'reading',
            '다 읽은 책': 'finished'
        }[selectedSavedBookCategory.value];

        const newCategoryKey = {
            '읽고 싶은 책': 'wantToRead',
            '읽는 중인 책': 'reading',
            '다 읽은 책': 'finished'
        }[newCategory];

        // 기존 카테고리에서 책 제거
        savedBooks[oldCategoryKey] = savedBooks[oldCategoryKey].filter(book => book.isbn !== updatedBook.isbn);

        // 새로운 카테고리에 책 추가
        savedBooks[newCategoryKey].push(updatedBook);

        localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
        selectedSavedBookCategory.value = newCategory; // 카테고리 업데이트
    };

    const deleteSavedBook = (isbn, category) => {
        const savedBooks = JSON.parse(localStorage.getItem('savedBooks')) || {
            wantToRead: [],
            reading: [],
            finished: []
        };

        const categoryKey = {
            '읽고 싶은 책': 'wantToRead',
            '읽는 중인 책': 'reading',
            '다 읽은 책': 'finished'
        }[category];

        // 해당 카테고리에서 책 제거
        savedBooks[categoryKey] = savedBooks[categoryKey].filter(book => book.isbn !== isbn);

        localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    };

    return {
        query,
        books,
        selectedBook,
        showModal,
        categories,
        selectedCategory,
        pages,
        readingPage,
        comment,
        startDate,
        endDate,
        rating,
        searchBooks,
        selectBook,
        closeModal,
        setQuery,
        saveBook,
        selectedSavedBook,
        showSavedBookModal,
        selectedSavedBookCategory,
        selectSavedBook,
        closeSavedBookModal,
        updateSavedBook,
        deleteSavedBook
    };
});