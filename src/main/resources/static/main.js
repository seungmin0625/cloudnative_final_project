// src/main/resources/static/main.js
const API_URL = '/api/boards';

// 페이지 로드 시 게시글 목록을 불러오는 함수
document.addEventListener('DOMContentLoaded', fetchPosts);

// 1. 게시글 전체 조회 (Read All)
async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();
        const listBody = document.querySelector('#board-list tbody');
        listBody.innerHTML = ''; // 기존 목록 초기화

        posts.forEach(post => {
            const row = listBody.insertRow();
            row.insertCell(0).textContent = post.id;

            // 제목 클릭 시 수정/삭제 폼에 데이터 로드
            const titleCell = row.insertCell(1);
            const titleLink = document.createElement('a');
            titleLink.textContent = post.title;
            titleLink.href = "#"; // 링크 이동 방지
            titleLink.onclick = () => loadPostForEdit(post.id);
            titleCell.appendChild(titleLink);

            row.insertCell(2).textContent = post.author;

            // 삭제 버튼 추가
            const actionCell = row.insertCell(3);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.onclick = () => deletePost(post.id);
            actionCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// 2. 게시글 저장 (Create/Update)
async function savePost() {
    const id = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    if (!title || !content) {
        alert('제목과 내용을 입력해주세요.');
        return;
    }

    const method = id ? 'PUT' : 'POST'; // ID가 있으면 수정(PUT), 없으면 생성(POST)
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }), // 백엔드로 전송할 데이터
        });

        if (response.ok) {
            alert(id ? '게시글이 수정되었습니다.' : '게시글이 작성되었습니다.');
            resetForm(); // 폼 초기화
            fetchPosts(); // 목록 새로고침
        } else {
            alert('저장 실패: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error saving post:', error);
    }
}

// 3. 게시글 정보 로드 (for Edit)
async function loadPostForEdit(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const post = await response.json();

        // 폼에 데이터 채우기
        document.getElementById('postId').value = post.id;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
    } catch (error) {
        console.error('Error loading post for edit:', error);
        alert('게시글 정보를 불러오지 못했습니다.');
    }
}

// 4. 게시글 삭제 (Delete)
async function deletePost(id) {
    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('게시글이 삭제되었습니다.');
                fetchPosts(); // 목록 새로고침
            } else {
                alert('삭제 실패: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
}

// 폼 초기화
function resetForm() {
    document.getElementById('postId').value = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
}