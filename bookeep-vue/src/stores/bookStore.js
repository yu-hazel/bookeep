import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = '/supabase';
const supabaseUrl = 'https://vovzpunshmcodmkletaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdnpwdW5zaG1jb2Rta2xldGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgxMDg5MzUsImV4cCI6MjAzMzY4NDkzNX0.aVXi_AbLx-AGNwWVa0MB-WiNrkht2Eq0ECnBwDds2Kc';
const supabase = createClient(supabaseUrl, supabaseKey);

export const useBookStore = defineStore('bookStore', () => {
    const router = useRouter();
    const isLoggedIn = ref(false); // 로그인 상태

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
    const readingPage = ref('');

    const publisher = ref('');
    const datetime = ref('');

    const user = ref(null);

    const setUser = (userData) => {
        user.value = userData;
        isLoggedIn.value = !!userData;
        if (userData) {
            loadBooks();
        }
    };

    // const isLoggedIn = computed(() => user.value !== null);

    const selectedSavedBook = ref(null);
    const showSavedBookModal = ref(false);
    const selectedSavedBookCategory = ref('');

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
            console.log('카카오 api 데이터 : ', data);

            // books.value = data.documents;

            books.value = data.documents.map(book => ({
                ...book,
                publisher: book.publisher || '정보 없음', // publisher 필드 추가
                datetime: book.datetime || '정보 없음' // datetime 필드 추가
            }));
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

        publisher.value = book.publisher; // 추가
        datetime.value = book.datetime;
    };

    const closeModal = () => {
        showModal.value = false;
    };

    const setQuery = (newQuery) => {
        query.value = newQuery;
    };

    const saveBook = async () => {
        // if (!user.value) {
        //     console.error('사용자가 로그인되어 있지 않습니다.');
        //     return;
        // }

        if (!isLoggedIn.value) {
            router.push('/BeforeLogin'); // 로그인 페이지로 리디렉션
            return;
        }

        const bookData = {
            user_id: user.value.id,
            title: selectedBook.value.title,
            publisher: selectedBook.value.publisher,
            datetime: selectedBook.value.datetime,
            thumbnail: selectedBook.value.thumbnail,
            authors: JSON.stringify(selectedBook.value.authors),
            isbn: selectedBook.value.isbn,
            pages: pages.value,
            reading_page: readingPage.value,
            comment: comment.value,
            start_date: startDate.value === '' ? null : startDate.value,
            end_date: endDate.value === '' ? null : endDate.value,
            rating: rating.value,
            category: selectedCategory.value
        };

        // console.log('Saving book data:', bookData); // 요청 데이터 로그 추가

        try {
            // 중복 확인 로직
            const { data: existingBooks, error: fetchError } = await supabase
                .from('books')
                .select('isbn')
                .eq('user_id', user.value.id);
            if (fetchError) {
                console.error('Error fetching books:', fetchError);
                throw fetchError;
            }
            const isDuplicate = existingBooks.some(book => book.isbn === selectedBook.value.isbn);
            if (isDuplicate) {
                alert('이미 저장된 책입니다.');
                return;
            }

            // 중복 아니면 저장
            const { data, error } = await supabase
                .from('books')
                .insert([bookData]);

            if (error) {
                console.error('Supabase error:', error); // Supabase 에러 로그 추가
                throw error;
            }

            alert('책이 저장되었습니다.');
            loadBooks();
            closeModal();
        } catch (error) {
            console.error('Error saving book:', error);
            alert('책 저장에 실패했습니다.');
        }
    };

    const loadBooks = async () => {
        if (!user.value) return;
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('user_id', user.value.id);

            if (error) {
                throw error;
            }

            console.log('Fetched books:', data); // 데이터 콘솔에 출력

            const categorizedBooks = {
                wantToRead: [],
                reading: [],
                finished: [],
                all: [] // 전체 책 목록 추가
            };

            data.forEach(book => {
                try {
                    book.authors = JSON.parse(book.authors); // authors를 JSON 형식으로 파싱
                } catch (e) {
                    book.authors = []; // 파싱 실패 시 빈 배열로 설정
                }

                if (book.datetime) {
                    book.datetime = book.datetime.split('-')[0];
                }

                if (book.category === '읽고 싶은 책') {
                    categorizedBooks.wantToRead.push(book);
                } else if (book.category === '읽는 중인 책') {
                    categorizedBooks.reading.push(book);
                } else if (book.category === '다 읽은 책') {
                    categorizedBooks.finished.push(book);
                }
                categorizedBooks.all.push(book);  // 모든 책을 추가
            });

            books.value = categorizedBooks;
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };

    const selectSavedBook = (book, category) => {
        selectedSavedBook.value = book;
        showSavedBookModal.value = true;
        selectedSavedBookCategory.value = category;

        if (category === '읽는 중인 책') {
            readingPage.value = book.reading_page || '';
        }
    };

    const closeSavedBookModal = () => {
        showSavedBookModal.value = false;
        selectedSavedBookCategory.value = '';
    };

    const updateSavedBook = async (updatedBook, newCategory) => {
        try {
            const { data, error } = await supabase
                .from('books')
                .upsert({
                    id: updatedBook.id,
                    user_id: user.value.id,
                    title: updatedBook.title,
                    publisher: updatedBook.publisher,
                    datetime: updatedBook.datetime,
                    thumbnail: updatedBook.thumbnail,
                    authors: JSON.stringify(updatedBook.authors),
                    isbn: updatedBook.isbn,
                    pages: updatedBook.pages,
                    reading_page: updatedBook.reading_page,
                    comment: updatedBook.comment,
                    start_date: updatedBook.start_date === '' ? null : updatedBook.start_date,
                    end_date: updatedBook.end_date === '' ? null : updatedBook.end_date,
                    rating: updatedBook.rating,
                    category: newCategory
                })
                .select();

            if (error) {
                throw error;
            }

            alert('책이 업데이트되었습니다.');
            await loadBooks();
            closeSavedBookModal();
        } catch (error) {
            console.error('Error updating book:', error);
            alert('책 업데이트에 실패했습니다.');
        }
    };

    const deleteSavedBook = async (bookId) => {
        try {
            const { error } = await supabase
                .from('books')
                .delete()
                .eq('id', bookId);

            if (error) {
                throw error;
            }

            alert('책이 삭제되었습니다.');
            loadBooks();
            closeSavedBookModal();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('책 삭제에 실패했습니다.');
        }
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
        publisher,
        datetime,
        searchBooks,
        selectBook,
        closeModal,
        setQuery,
        saveBook,
        setUser,
        selectedSavedBook,
        showSavedBookModal,
        selectedSavedBookCategory,
        selectSavedBook,
        closeSavedBookModal,
        updateSavedBook,
        deleteSavedBook,
        loadBooks,
        isLoggedIn,
    };
});