// 스크롤 시 네비게이션 바 스타일 변경
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = '#fff';
    }
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 문의하기 폼 제출 처리
const contactForm = document.querySelector('form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // 여기에 실제로 서버로 데이터를 전송하는 코드를 추가할 수 있습니다.
        // 예: fetch API 사용
        
        alert('문의가 접수되었습니다. 감사합니다!');
        contactForm.reset();
    });
}

// 추천도서 표시
document.addEventListener('DOMContentLoaded', () => {
    const bookContainer = document.getElementById('bookContainer');
    const books = JSON.parse(localStorage.getItem('books')) || [];

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <a href="${book.kyoboLink}" target="_blank">
                <img src="${book.image}" alt="${book.title}">
            </a>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
        `;
        bookContainer.appendChild(bookItem);
    });
});

// 회원가입 모달 관련 요소
const joinBtn = document.getElementById('joinBtn');
const joinModal = document.getElementById('joinModal');
const closeBtn = document.querySelector('.close');
const joinForm = document.getElementById('joinForm');

// 회원가입 버튼 클릭 이벤트
joinBtn.addEventListener('click', () => {
    document.getElementById('joinModal').style.display = 'block';
});

// 모달 닫기 버튼 클릭 이벤트
closeBtn.addEventListener('click', () => {
    document.getElementById('joinModal').style.display = 'none';
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === joinModal) {
        joinModal.style.display = 'none';
    }
});

// 회원가입 폼 제출
document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMember = {
        name: document.getElementById('memberName').value,
        phone: document.getElementById('memberPhone').value,
        age: document.getElementById('memberAge').value,
        date: new Date().toLocaleDateString()
    };
    
    // pendingMembers 배열에 저장
    let pendingMembers = JSON.parse(localStorage.getItem('pendingMembers')) || [];
    pendingMembers.push(newMember);
    localStorage.setItem('pendingMembers', JSON.stringify(pendingMembers));
    
    // 모달 닫기
    document.getElementById('joinModal').style.display = 'none';
    document.getElementById('joinForm').reset();
    
    alert('가입 신청이 완료되었습니다. 관리자의 승인을 기다려주세요.');
}); 