let jobs = [];
let students = [];
let applications = {};
let results = {};
let jobCounts = {}; // 각 역할별 선발 인원 저장

// 로컬 스토리지에 데이터 저장
function saveToLocalStorage() {
    localStorage.setItem('jobs', JSON.stringify(jobs));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('applications', JSON.stringify(applications));
    localStorage.setItem('jobCounts', JSON.stringify(jobCounts));
}

// 로컬 스토리지에서 데이터 불러오기
function loadFromLocalStorage() {
    const savedJobs = localStorage.getItem('jobs');
    const savedStudents = localStorage.getItem('students');
    const savedApplications = localStorage.getItem('applications');
    const savedJobCounts = localStorage.getItem('jobCounts');
    
    if (savedJobs) jobs = JSON.parse(savedJobs);
    if (savedStudents) students = JSON.parse(savedStudents);
    if (savedApplications) applications = JSON.parse(savedApplications);
    if (savedJobCounts) jobCounts = JSON.parse(savedJobCounts);
    
    // 불러온 데이터 화면에 표시
    updateJobList();
    updateStudentList();
    updateJobSelect();
    updateStudentSelect();
    updateApplicationList();
}

// 일괄 업로드 영역 토글 함수
function toggleJobUpload() {
    const uploadArea = document.getElementById('jobUploadArea');
    uploadArea.classList.toggle('show');
    const toggleBtn = document.querySelector('.bulk-upload .toggle-btn');
    
    // 역할 목록 섹션 참조
    const jobSection = document.querySelector('.section:first-child');
    
    if (uploadArea.classList.contains('show')) {
        toggleBtn.textContent = '일괄 업로드 ▲';
        jobSection.classList.add('upload-area-visible'); // 목록 높이 줄이기 클래스 추가
    } else {
        toggleBtn.textContent = '일괄 업로드 ▼';
        jobSection.classList.remove('upload-area-visible'); // 목록 높이 정상화 클래스 제거
    }
}

function toggleStudentUpload() {
    const uploadArea = document.getElementById('studentUploadArea');
    uploadArea.classList.toggle('show');
    const toggleBtn = document.querySelector('.section:nth-child(2) .bulk-upload .toggle-btn');
    
    // 학생 목록 섹션 참조
    const studentSection = document.querySelector('.section:nth-child(2)');
    
    if (uploadArea.classList.contains('show')) {
        toggleBtn.textContent = '일괄 업로드 ▲';
        studentSection.classList.add('upload-area-visible'); // 목록 높이 줄이기 클래스 추가
    } else {
        toggleBtn.textContent = '일괄 업로드 ▼';
        studentSection.classList.remove('upload-area-visible'); // 목록 높이 정상화 클래스 제거
    }
}

// 일괄 추가 함수
function bulkAddJobs() {
    const input = document.getElementById('jobBulkInput').value.trim();
    if (!input) return;
    
    // 쉼표와 줄바꿈으로 구분된 텍스트를 배열로 변환
    const newJobs = input.split(/[,\n]+/)
        .map(job => job.trim())
        .filter(job => job && !jobs.includes(job));
    
    // 중복 제거 후 추가
    newJobs.forEach(job => {
        if (!jobs.includes(job)) {
            jobs.push(job);
        }
    });
    
    // 목록 업데이트
    updateJobList();
    updateJobSelect();
    
    // 입력 필드 초기화
    document.getElementById('jobBulkInput').value = '';
    
    // 로컬 스토리지에 저장
    saveToLocalStorage();
    
    // 성공 메시지 표시
    if (newJobs.length > 0) {
        alert(`${newJobs.length}개의 아르바이트가 추가되었습니다.`);
    } else {
        alert('추가된 아르바이트가 없습니다. 중복된 이름이 있는지 확인하세요.');
    }
}

function bulkAddStudents() {
    const input = document.getElementById('studentBulkInput').value.trim();
    if (!input) return;
    
    // 쉼표와 줄바꿈으로 구분된 텍스트를 배열로 변환
    const newStudents = input.split(/[,\n]+/)
        .map(student => student.trim())
        .filter(student => student && !students.includes(student));
    
    // 중복 제거 후 추가
    newStudents.forEach(student => {
        if (!students.includes(student)) {
            students.push(student);
        }
    });
    
    // 목록 업데이트
    updateStudentList();
    updateStudentSelect();
    
    // 입력 필드 초기화
    document.getElementById('studentBulkInput').value = '';
    
    // 로컬 스토리지에 저장
    saveToLocalStorage();
    
    // 성공 메시지 표시
    if (newStudents.length > 0) {
        alert(`${newStudents.length}명의 학생이 추가되었습니다.`);
    } else {
        alert('추가된 학생이 없습니다. 중복된 이름이 있는지 확인하세요.');
    }
}

function addJob() {
    const jobName = document.getElementById('jobInput').value.trim();
    if (jobName && !jobs.includes(jobName)) {
        jobs.push(jobName);
        jobCounts[jobName] = 1; // 기본 선발 인원 1명으로 설정
        updateJobList();
        updateJobSelect();
        updateApplicationList();
        document.getElementById('jobInput').value = '';
        saveToLocalStorage(); // 로컬 스토리지에 저장
    }
}

function updateJobList() {
    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '';
    jobs.forEach(job => {
        const li = document.createElement('li');
        
        // 텍스트를 span으로 감싸기
        const textSpan = document.createElement('span');
        textSpan.textContent = job;
        li.appendChild(textSpan);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteJob(job);
        li.appendChild(deleteBtn);
        jobList.appendChild(li);
    });
}

function deleteJob(job) {
    jobs = jobs.filter(j => j !== job);
    delete applications[job];
    delete results[job];
    delete jobCounts[job]; // 선발 인원 정보도 삭제
    updateJobList();
    updateJobSelect();
    updateApplicationList();
    updateResultList();
    saveToLocalStorage(); // 로컬 스토리지에 저장
}

function addStudent() {
    const studentName = document.getElementById('studentInput').value.trim();
    if (studentName && !students.includes(studentName)) {
        students.push(studentName);
        updateStudentList();
        updateStudentSelect();
        document.getElementById('studentInput').value = '';
        saveToLocalStorage(); // 로컬 스토리지에 저장
    }
}

function updateStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';
    students.forEach(student => {
        const li = document.createElement('li');
        
        // 텍스트를 span으로 감싸기
        const textSpan = document.createElement('span');
        textSpan.textContent = student;
        li.appendChild(textSpan);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteStudent(student);
        li.appendChild(deleteBtn);
        studentList.appendChild(li);
    });
}

function deleteStudent(student) {
    students = students.filter(s => s !== student);
    for (let job in applications) {
        applications[job] = applications[job].filter(s => s !== student);
    }
    for (let job in results) {
        results[job] = results[job].filter(s => s !== student);
    }
    updateStudentList();
    updateStudentSelect();
    updateApplicationList();
    updateResultList();
    saveToLocalStorage(); // 로컬 스토리지에 저장
}

function updateJobSelect() {
    const jobSelect = document.getElementById('jobSelect');
    jobSelect.innerHTML = '';
    jobs.forEach(job => {
        const option = document.createElement('option');
        option.value = job;
        option.textContent = job;
        jobSelect.appendChild(option);
    });
}

function updateStudentSelect() {
    const studentSelect = document.getElementById('studentSelect');
    studentSelect.innerHTML = '';
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student;
        option.textContent = student;
        studentSelect.appendChild(option);
    });
}

function applyStudent() {
    const job = document.getElementById('jobSelect').value;
    const student = document.getElementById('studentSelect').value;
    if (job && student) {
        if (!applications[job]) {
            applications[job] = [];
        }
        if (!applications[job].includes(student)) {
            applications[job].push(student);
            updateApplicationList();
            saveToLocalStorage(); // 로컬 스토리지에 저장
        }
    }
}

function updateApplicationList() {
    const appList = document.getElementById('applicationList');
    appList.innerHTML = '';
    
    // 전체 초기화 버튼 추가
    if (Object.keys(applications).length > 0) {
        const resetDiv = document.createElement('div');
        resetDiv.className = 'reset-all-container';
        
        const resetButton = document.createElement('button');
        resetButton.textContent = '전체 초기화';
        resetButton.className = 'reset-all-btn';
        resetButton.onclick = resetAllApplications;
        
        resetDiv.appendChild(resetButton);
        appList.appendChild(resetDiv);
    }
    
    for (let job in applications) {
        const li = document.createElement('li');
        
        // 역할 정보 영역
        const jobInfoDiv = document.createElement('div');
        jobInfoDiv.className = 'job-info';
        
        const jobName = document.createElement('span');
        jobName.className = 'job-name';
        jobName.textContent = job;
        
        const applicantCount = document.createElement('span');
        applicantCount.className = 'applicant-count';
        applicantCount.textContent = `${applications[job].length}명`;
        
        jobInfoDiv.appendChild(jobName);
        jobInfoDiv.appendChild(applicantCount);
        
        // 선발 인원 설정
        const countDiv = document.createElement('div');
        countDiv.className = 'job-count-container';
        
        const countLabel = document.createElement('label');
        countLabel.textContent = '선발 인원:';
        countLabel.htmlFor = `count-${job}`;
        
        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.id = `count-${job}`;
        countInput.className = 'job-count-input';
        countInput.min = '1';
        countInput.value = jobCounts[job] || 1;
        countInput.addEventListener('change', function() {
            jobCounts[job] = parseInt(this.value) || 1;
            saveToLocalStorage();
        });
        
        countDiv.appendChild(countLabel);
        countDiv.appendChild(countInput);
        
        // 지원자 관리 버튼 영역
        const btnContainer = document.createElement('div');
        btnContainer.className = 'job-buttons-container';
        
        // 지원자 목록 보기 버튼
        const viewBtn = document.createElement('button');
        viewBtn.textContent = '지원자 보기';
        viewBtn.className = 'view-applicants-btn';
        viewBtn.onclick = () => viewApplicants(job);
        
        // 지원 취소 버튼
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '모두 취소';
        clearBtn.className = 'clear-applicants-btn';
        clearBtn.onclick = () => clearApplicants(job);
        
        btnContainer.appendChild(viewBtn);
        btnContainer.appendChild(clearBtn);
        
        li.appendChild(jobInfoDiv);
        li.appendChild(countDiv);
        li.appendChild(btnContainer);
        appList.appendChild(li);
    }
}

// 특정 역할의 지원자 목록을 모달로 보여주는 함수
function viewApplicants(job) {
    const modal = document.getElementById('applicantsModal');
    const modalTitle = document.getElementById('applicantsModalLabel');
    const modalBody = document.getElementById('applicantsList');
    
    modalTitle.textContent = `[${job}] 지원자 목록`;
    modalBody.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'd-flex justify-content-between align-items-center mb-3';
    
    const title = document.createElement('h5');
    title.className = 'mb-0';
    title.textContent = `총 ${applications[job]?.length || 0}명의 지원자`;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'modal');
    closeBtn.setAttribute('aria-label', 'Close');
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    modalBody.appendChild(header);
    
    // Create applicants list container
    const listContainer = document.createElement('div');
    listContainer.className = 'applicants-list';
    
    if (applications[job] && applications[job].length > 0) {
        applications[job].forEach((student, index) => {
            const item = document.createElement('div');
            item.className = 'applicant-item';
            
            const info = document.createElement('div');
            info.className = 'd-flex align-items-center';
            
            const number = document.createElement('span');
            number.className = 'me-2 text-muted';
            number.style.width = '24px';
            number.textContent = `${index + 1}.`;
            
            const name = document.createElement('span');
            name.className = 'applicant-name';
            name.textContent = student;
            
            const actions = document.createElement('div');
            actions.className = 'ms-auto';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '&times; 삭제';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`${student} 지원자를 삭제하시겠습니까?`)) {
                    const index = applications[job].indexOf(student);
                    if (index !== -1) {
                        applications[job].splice(index, 1);
                        saveToLocalStorage();
                        viewApplicants(job); // Refresh the list
                        updateApplicationList();
                    }
                }
            };
            
            info.appendChild(number);
            info.appendChild(name);
            actions.appendChild(deleteBtn);
            
            item.appendChild(info);
            item.appendChild(actions);
            listContainer.appendChild(item);
        });
    } else {
        const emptyState = document.createElement('div');
        emptyState.className = 'text-center py-5 text-muted';
        emptyState.innerHTML = `
            <i class="bi bi-people fs-1 d-block mb-2"></i>
            <p class="mb-0">아직 지원자가 없습니다.</p>
        `;
        listContainer.appendChild(emptyState);
    }
    
    modalBody.appendChild(listContainer);
    
    // Footer with action buttons
    const footer = document.createElement('div');
    footer.className = 'modal-footer d-flex justify-content-between';
    
    const deleteAllBtn = document.createElement('button');
    deleteAllBtn.className = 'btn btn-outline-danger';
    deleteAllBtn.innerHTML = '<i class="bi bi-trash"></i> 전체 삭제';
    deleteAllBtn.onclick = function() {
        if (confirm(`[${job}]의 모든 지원자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
            applications[job] = [];
            saveToLocalStorage();
            viewApplicants(job);
            updateApplicationList();
        }
    };
    
    const closeBtnFooter = document.createElement('button');
    closeBtnFooter.className = 'btn btn-primary';
    closeBtnFooter.textContent = '닫기';
    closeBtnFooter.setAttribute('data-bs-dismiss', 'modal');
    
    footer.appendChild(deleteAllBtn);
    footer.appendChild(closeBtnFooter);
    modalBody.appendChild(footer);
    
    // Show the modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// 특정 역할의 모든 지원자를 취소하는 함수
function clearApplicants(job) {
    if (!applications[job] || applications[job].length === 0) {
        alert('취소할 지원자가 없습니다.');
        return;
    }
    
    if (confirm(`${job} 역할의 모든 지원자(${applications[job].length}명)를 취소하시겠습니까?`)) {
        applications[job] = [];
        updateApplicationList();
        saveToLocalStorage();
        alert('지원이 취소되었습니다.');
    }
}

// 모달창에서 특정 역할의 모든 지원자를 취소하는 함수
function clearApplicantsModal(job) {
    if (!applications[job] || applications[job].length === 0) {
        alert('취소할 지원자가 없습니다.');
        return;
    }
    
    if (confirm(`${job} 역할의 모든 지원자(${applications[job].length}명)를 취소하시겠습니까?`)) {
        applications[job] = [];
        updateApplicationList();
        // 모달 테이블 업데이트
        updateApplicationsTable();
        saveToLocalStorage();
        alert('지원이 취소되었습니다.');
    }
}

// 특정 역할에서 특정 학생의 지원을 취소하는 함수
function cancelApplication(job, student) {
    if (applications[job]) {
        applications[job] = applications[job].filter(s => s !== student);
        updateApplicationList();
        saveToLocalStorage();
    }
}

// 모든 지원 내역을 초기화하는 함수
function resetAllApplications() {
    if (confirm('모든 지원 내역을 초기화하시겠습니까?')) {
        applications = {};
        updateApplicationList();
        saveToLocalStorage();
        alert('모든 지원 내역이 초기화되었습니다.');
    }
}

function randomSelect() {
    results = {};
    
    for (let job in applications) {
        const applicants = applications[job];
        if (applicants.length > 0) {
            results[job] = [];
            
            // 해당 역할의 선발 인원 가져오기
            const jobSelectCount = jobCounts[job] || 1;
            
            // 지원자가 선발 인원보다 적을 경우 모두 선발
            if (applicants.length <= jobSelectCount) {
                results[job] = [...applicants];
            } else {
                // 중복 없이 랜덤하게 선발
                const shuffled = [...applicants];
                // Fisher-Yates 셔플 알고리즘
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                // 역할별로 설정한 인원 수만큼 선발
                results[job] = shuffled.slice(0, jobSelectCount);
            }
        }
    }
    updateResultList();
    
    // 결과 영역으로 스크롤
    document.getElementById('resultList').scrollIntoView({ behavior: 'smooth' });
}

function updateResultList() {
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = '';
    for (let job in results) {
        const li = document.createElement('li');
        
        // 텍스트를 span으로 감싸기
        const textSpan = document.createElement('span');
        textSpan.textContent = `${job}: ${results[job].join(', ')}`;
        li.appendChild(textSpan);
        
        resultList.appendChild(li);
    }
}

// 모달 창 관련 기능
document.addEventListener('DOMContentLoaded', function() {
    // 도움말 모달 관련 설정
    const helpModal = document.getElementById('helpModal');
    const helpBtn = document.getElementById('helpBtn');
    const helpCloseBtn = helpModal.querySelector('.close-button');
    
    // 지원자 모달 관련 설정
    const applicationsModal = document.getElementById('applicationsModal');
    const expandBtn = document.getElementById('expandApplicationsBtn');
    const appCloseBtn = applicationsModal.querySelector('.close-button');
    
    // 사용법 버튼 클릭 시 모달 열기
    helpBtn.addEventListener('click', function() {
        console.log('도움말 버튼 클릭됨');
        helpModal.style.display = 'block';
    });
    
    // 확대 버튼 클릭 시 지원자 모달 열기
    expandBtn.addEventListener('click', function() {
        console.log('확대 버튼 클릭됨');
        updateApplicationsTable();
        applicationsModal.style.display = 'block';
    });
    
    // X 버튼 클릭 시 모달 닫기
    helpCloseBtn.addEventListener('click', function() {
        console.log('도움말 닫기 버튼 클릭됨');
        helpModal.style.display = 'none';
    });
    
    appCloseBtn.addEventListener('click', function() {
        console.log('모달 닫기 버튼 클릭됨');
        applicationsModal.style.display = 'none';
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        }
        if (event.target === applicationsModal) {
            applicationsModal.style.display = 'none';
        }
    });
    
    // ESC 키 누를 때 모달 닫기
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            helpModal.style.display = 'none';
            applicationsModal.style.display = 'none';
        }
    });
    
    // 로컬 스토리지에서 데이터 불러오기
    loadFromLocalStorage();
});

// 지원자 모달의 테이블 업데이트
// 모달에서 지원자 취소 기능
function clearApplicantsModal(job) {
    if (confirm(`${job} 역할의 모든 지원자를 취소하시겠습니까?`)) {
        applications[job] = [];
        saveToLocalStorage();
        updateApplicationList();
        updateApplicationsTable();
    }
}

function updateApplicationsTable() {
    const tableContainer = document.querySelector('#applicationsModal .modal-body');
    tableContainer.innerHTML = '';
    
    // 테이블 생성
    const table = document.createElement('table');
    table.id = 'applicationsTable';
    table.className = 'applications-table';
    
    // 테이블 헤더
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['역할명', '지원자 목록', '지원자 수', '선발 인원', '관리'];
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 테이블 바디
    const tbody = document.createElement('tbody');
    
    // 역할별 데이터 추가
    for (let job in applications) {
        const applicants = applications[job];
        
        const row = document.createElement('tr');
        
        // 역할명
        const jobCell = document.createElement('td');
        jobCell.textContent = job;
        row.appendChild(jobCell);
        
        // 지원자 목록
        const applicantsCell = document.createElement('td');
        const applicantsList = document.createElement('div');
        applicantsList.className = 'applicants-list-modal';
        
        if (applicants.length > 0) {
            applicants.forEach(student => {
                const applicantItem = document.createElement('div');
                applicantItem.textContent = student;
                applicantItem.title = '클릭하면 지원자를 삭제합니다';
                
                // 지원자 클릭 시 삭제 기능
                applicantItem.addEventListener('click', function() {
                    if (confirm(`${student} 지원자를 삭제하시겠습니까?`)) {
                        // 해당 지원자 삭제
                        const index = applications[job].indexOf(student);
                        if (index !== -1) {
                            applications[job].splice(index, 1);
                            saveToLocalStorage();
                            updateApplicationList();
                            updateApplicationsTable();
                        }
                    }
                });
                
                applicantsList.appendChild(applicantItem);
            });
        } else {
            const noApplicants = document.createElement('div');
            noApplicants.textContent = '지원자 없음';
            noApplicants.style.color = '#6c757d';
            applicantsList.appendChild(noApplicants);
        }
        
        applicantsCell.appendChild(applicantsList);
        row.appendChild(applicantsCell);
        
        // 지원자 수
        const countCell = document.createElement('td');
        countCell.textContent = applicants.length;
        row.appendChild(countCell);
        
        // 선발 인원
        const selectCountCell = document.createElement('td');
        const selectCountInput = document.createElement('input');
        selectCountInput.type = 'number';
        selectCountInput.className = 'job-count-input';
        selectCountInput.min = '1';
        selectCountInput.value = jobCounts[job] || 1;
        selectCountInput.addEventListener('change', function() {
            jobCounts[job] = parseInt(this.value) || 1;
            saveToLocalStorage();
            updateApplicationList();
        });
        selectCountCell.appendChild(selectCountInput);
        row.appendChild(selectCountCell);
        
        // 관리 버튼
        const actionsCell = document.createElement('td');
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'action-buttons';
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '초기화';
        clearBtn.className = 'clear-applicants-btn';
        clearBtn.onclick = () => clearApplicantsModal(job);
        
        actionsDiv.appendChild(clearBtn);
        actionsCell.appendChild(actionsDiv);
        row.appendChild(actionsCell);
        
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    
    // 역할이 없는 경우 안내 메시지
    if (Object.keys(applications).length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '40px';
        emptyMessage.style.color = '#6c757d';
        emptyMessage.innerHTML = '<p>지원자가 없습니다.</p>';
        tableContainer.appendChild(emptyMessage);
    }
    
    // 전체 초기화 버튼 추가 (우측 하단)
    if (Object.keys(applications).length > 0) {
        const resetAllContainer = document.createElement('div');
        resetAllContainer.className = 'reset-all-modal-container';
        
        const resetAllBtn = document.createElement('button');
        resetAllBtn.textContent = '전체 초기화';
        resetAllBtn.className = 'reset-all-modal-btn';
        resetAllBtn.onclick = function() {
            if (confirm('모든 지원 내역을 초기화하시겠습니까?')) {
                resetAllApplications();
                updateApplicationsTable();
            }
        };
        
        resetAllContainer.appendChild(resetAllBtn);
        tableContainer.appendChild(resetAllContainer);
    }
}
