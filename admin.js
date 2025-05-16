// 도서 관리 기능
let books = JSON.parse(localStorage.getItem('books')) || [];
let isEditing = false;
let currentEditIndex = -1;

// 관리자 모달 관련 요소
const bookForm = document.getElementById('bookForm');
const bookContainer = document.getElementById('bookContainer');
const currentBooks = document.getElementById('currentBooks');
const submitButton = document.getElementById('submitButton');

// 버튼과 섹션 요소
const bookManagementBtn = document.getElementById('bookManagementBtn');
const inquiryBtn = document.getElementById('inquiryBtn');
const memberListBtn = document.getElementById('memberListBtn');
const infoBtn = document.getElementById('infoBtn');

const bookManagementSection = document.getElementById('bookManagement');
const inquirySection = document.getElementById('inquirySection');
const memberListSection = document.getElementById('memberListSection');
const infoSection = document.getElementById('infoSection');

// 회원 관리 기능
let members = JSON.parse(localStorage.getItem('members')) || [];
let pendingMembers = JSON.parse(localStorage.getItem('pendingMembers')) || [];

// 이미지 크기 조정 함수
function resizeImage(imageData, maxWidth = 80, maxHeight = 90) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // 이미지 비율 계산
            if (width > maxWidth) {
                height = (maxWidth * height) / width;
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = (maxHeight * width) / height;
                height = maxHeight;
            }

            // 캔버스 생성 및 이미지 리사이즈
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // 리사이즈된 이미지를 Base64로 변환
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = imageData;
    });
}

// 이미지 미리보기 기능
const imageInput = document.getElementById('bookImage');
const imagePreview = document.getElementById('imagePreview');

imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            resizeImage(e.target.result).then(resizedImage => {
                imagePreview.style.display = 'block';
                imagePreview.innerHTML = `<img src="${resizedImage}" alt="미리보기">`;
            });
        }
        reader.readAsDataURL(file);
    }
});

// 도서 추가 폼 제출
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const imageFile = document.getElementById('bookImage').files[0];
    if (!imageFile && !isEditing) {
        alert('이미지를 선택해주세요.');
        return;
    }

    const newBook = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        kyoboLink: document.getElementById('bookKyoboLink').value
    };

    if (isEditing) {
        // 기존 이미지를 유지하면서 수정
        newBook.image = books[currentEditIndex].image;
        books[currentEditIndex] = newBook;
        isEditing = false;
        currentEditIndex = -1;
        submitButton.textContent = '도서 추가';
        submitButton.classList.remove('editing');
    } else {
        // 새 이미지 처리
        const reader = new FileReader();
        reader.onload = function(e) {
            resizeImage(e.target.result).then(resizedImage => {
                newBook.image = resizedImage;
                books.push(newBook);
                localStorage.setItem('books', JSON.stringify(books));
                updateBookDisplay();
                updateCurrentBooksList();
                bookForm.reset();
                imagePreview.style.display = 'none';
            });
        }
        reader.readAsDataURL(imageFile);
    }

    localStorage.setItem('books', JSON.stringify(books));
    updateBookDisplay();
    updateCurrentBooksList();
    bookForm.reset();
    imagePreview.style.display = 'none';
});

// 도서 표시 업데이트
function updateBookDisplay() {
    bookContainer.innerHTML = '';
    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <a href="${book.kyoboLink}" target="_blank">
                <img src="${book.image}" alt="${book.title}">
            </a>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <div class="book-actions">
                <button class="edit-btn" onclick="editBook(${index})">수정</button>
                <button class="delete-btn" onclick="deleteBook(${index})">삭제</button>
            </div>
        `;
        bookContainer.appendChild(bookItem);
    });
}

// 도서 수정 함수
window.editBook = function(index) {
    const book = books[index];
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookKyoboLink').value = book.kyoboLink;
    
    isEditing = true;
    currentEditIndex = index;
    submitButton.textContent = '수정 완료';
    submitButton.classList.add('editing');
    
    // 이미지 미리보기 표시
    imagePreview.src = book.image;
    imagePreview.style.display = 'block';
};

// 도서 삭제 함수
window.deleteBook = function(index) {
    if (confirm('정말로 이 도서를 삭제하시겠습니까?')) {
        books.splice(index, 1);
        localStorage.setItem('books', JSON.stringify(books));
        updateBookDisplay();
        updateCurrentBooksList();
        
        // 현재 도서 목록에서도 도서 삭제
        const currentBooksItems = document.querySelectorAll('.book-list-item');
        currentBooksItems[index].remove();
    }
};

// 현재 도서 목록 업데이트
function updateCurrentBooksList() {
    currentBooks.innerHTML = '';
    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-list-item';
        bookItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="book-list-item-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
            <div class="book-list-item-actions">
                <button class="edit-book" onclick="editBook(${index})">수정</button>
                <button class="delete-book" onclick="deleteBook(${index})">삭제</button>
            </div>
        `;
        currentBooks.appendChild(bookItem);
    });

    // 두 번째 도서 목록 추가
    const secondBookList = document.createElement('div');
    secondBookList.className = 'book-list';
    secondBookList.innerHTML = '<h3>추가 도서 목록</h3>';
    const secondCurrentBooks = document.createElement('div');
    secondCurrentBooks.id = 'secondCurrentBooks';
    secondBookList.appendChild(secondCurrentBooks);
    document.getElementById('bookManagement').appendChild(secondBookList);

    // 두 번째 도서 목록 업데이트
    books.forEach((book, index) => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-list-item';
        bookItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="book-list-item-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
            <div class="book-list-item-actions">
                <button class="edit-book" onclick="editBook(${index})">수정</button>
                <button class="delete-book" onclick="deleteBook(${index})">삭제</button>
            </div>
        `;
        secondCurrentBooks.appendChild(bookItem);
    });
}

// 도서 목록 자동 스크롤 기능
function setupAutoScroll() {
    const bookList = document.querySelector('.book-list');
    let scrollInterval;

    bookList.addEventListener('mouseenter', () => {
        scrollInterval = setInterval(() => {
            if (bookList.scrollTop < (bookList.scrollHeight - bookList.clientHeight)) {
                bookList.scrollTop += 1;
            } else {
                bookList.scrollTop = 0;
            }
        }, 50); // 50ms마다 1px씩 스크롤
    });

    bookList.addEventListener('mouseleave', () => {
        clearInterval(scrollInterval);
    });
}

// 초기화 시 자동 스크롤 설정
document.addEventListener('DOMContentLoaded', () => {
    setupAutoScroll();
    updateCurrentBooksList();
});

// 버튼 클릭 이벤트
bookManagementBtn.addEventListener('click', () => {
    showSection(bookManagementSection);
    setActiveButton(bookManagementBtn);
});

inquiryBtn.addEventListener('click', () => {
    showSection(inquirySection);
    setActiveButton(inquiryBtn);
});

memberListBtn.addEventListener('click', () => {
    showSection(memberListSection);
    setActiveButton(memberListBtn);
});

infoBtn.addEventListener('click', () => {
    showSection(infoSection);
    setActiveButton(infoBtn);
});

// 섹션 표시 함수
function showSection(section) {
    const sections = [bookManagementSection, inquirySection, memberListSection, infoSection];
    sections.forEach(s => s.style.display = 'none');
    section.style.display = 'block';
}

// 활성 버튼 설정 함수
function setActiveButton(button) {
    const buttons = [bookManagementBtn, inquiryBtn, memberListBtn, infoBtn];
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// 회원 목록 표시 함수
function updateMemberDisplay() {
    const pendingList = document.getElementById('pendingMemberList');
    const approvedList = document.getElementById('approvedMemberList');
    
    pendingList.innerHTML = '';
    approvedList.innerHTML = '';
    
    // 가입 신청 목록 표시
    pendingMembers.forEach((member, index) => {
        const memberElement = document.createElement('div');
        memberElement.className = 'member-item';
        memberElement.innerHTML = `
            <div class="member-info">${member.name}</div>
            <div class="member-info">${member.phone}</div>
            <div class="member-info">${member.age}</div>
            <div class="member-info">${member.date}</div>
            <div class="member-actions">
                <button class="approve-member" onclick="approveMember(${index})">승인</button>
                <button class="reject-member" onclick="rejectMember(${index})">거절</button>
            </div>
        `;
        pendingList.appendChild(memberElement);
    });
    
    // 회원 목록 표시
    members.forEach((member, index) => {
        const memberElement = document.createElement('div');
        memberElement.className = 'member-item';
        memberElement.innerHTML = `
            <div class="member-info">${member.name}</div>
            <div class="member-info">${member.phone}</div>
            <div class="member-info">${member.age}</div>
            <div class="member-info">${member.date}</div>
            <div class="member-actions">
                <button class="edit-member" onclick="editMember(${index})">수정</button>
                <button class="delete-member" onclick="deleteMember(${index})">삭제</button>
            </div>
        `;
        approvedList.appendChild(memberElement);
    });
}

function approveMember(index) {
    const member = pendingMembers[index];
    members.push(member);
    pendingMembers.splice(index, 1);
    
    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem('pendingMembers', JSON.stringify(pendingMembers));
    updateMemberDisplay();
}

function rejectMember(index) {
    pendingMembers.splice(index, 1);
    localStorage.setItem('pendingMembers', JSON.stringify(pendingMembers));
    updateMemberDisplay();
}

function editMember(index) {
    const member = members[index];
    const newName = prompt('이름:', member.name);
    const newPhone = prompt('전화번호:', member.phone);
    const newAge = prompt('나이:', member.age);
    
    if (newName && newPhone && newAge) {
        members[index] = {
            ...member,
            name: newName,
            phone: newPhone,
            age: newAge
        };
        localStorage.setItem('members', JSON.stringify(members));
        updateMemberDisplay();
    }
}

function deleteMember(index) {
    if (confirm('정말로 이 회원을 삭제하시겠습니까?')) {
        members.splice(index, 1);
        localStorage.setItem('members', JSON.stringify(members));
        updateMemberDisplay();
    }
}

// 페이지 로드 시 회원 목록 표시
document.addEventListener('DOMContentLoaded', () => {
    updateMemberDisplay();
});

// 회원가입 폼 제출
document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMember = {
        name: document.getElementById('memberName').value,
        phone: document.getElementById('memberPhone').value,
        age: document.getElementById('memberAge').value,
        joinDate: new Date().toLocaleDateString()
    };
    
    members.push(newMember);
    localStorage.setItem('members', JSON.stringify(members));
    
    // 모달 닫기
    document.getElementById('joinModal').style.display = 'none';
    document.getElementById('joinForm').reset();
    
    // 회원 목록 업데이트
    updateMemberDisplay();
});

// 회원가입 모달 열기/닫기
document.getElementById('joinBtn').addEventListener('click', () => {
    document.getElementById('joinModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('joinModal').style.display = 'none';
});

// 회원목록 버튼 클릭 시 회원 목록 표시
memberListBtn.addEventListener('click', () => {
    showSection(memberListSection);
    setActiveButton(memberListBtn);
    updateMemberDisplay();
}); 