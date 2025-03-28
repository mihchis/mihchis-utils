import React, { createContext, useState, useEffect } from 'react';

// Tạo language context
export const LanguageContext = createContext();

// Dữ liệu văn bản đa ngôn ngữ
export const translations = {
  vi: {
    // Phần header
    toggleTheme: "Chuyển chế độ",
    toggleLanguage: "Switch to English",

    // Phần trang chủ
    developerTools: "Developer Tools",
    toolsCollection: "Bộ sưu tập các công cụ hữu ích giúp bạn làm việc hiệu quả hơn",
    useButton: "Sử dụng →",

    // Phần sidebar
    textTools: "Công cụ Văn bản",
    codeTools: "Công cụ Mã",
    otherTools: "Công cụ Khác",

    // Phần footer
    copyright: "© 2025 mihchis. Tất cả các quyền được bảo lưu.",

    // Unit Converter
    unitConverterTitle: "Bộ Chuyển Đổi Đơn Vị",
    unitConverterDesc: "Chuyển đổi giữa các đơn vị đo lường khác nhau",
    unitConverterSubDesc: "Chuyển đổi giữa các đơn vị khác nhau của cùng một loại đo lường",
    length: "Chiều dài",
    weight: "Khối lượng",
    temperature: "Nhiệt độ",
    area: "Diện tích",
    volume: "Thể tích",
    time: "Thời gian",
    speed: "Tốc độ",
    lengthTitle: "Chuyển đổi chiều dài",
    lengthDesc: "Chuyển đổi giữa các đơn vị chiều dài khác nhau",
    weightTitle: "Chuyển đổi khối lượng",
    weightDesc: "Chuyển đổi giữa các đơn vị khối lượng khác nhau",
    temperatureTitle: "Chuyển đổi nhiệt độ",
    temperatureDesc: "Chuyển đổi giữa các đơn vị nhiệt độ khác nhau",
    areaTitle: "Chuyển đổi diện tích",
    areaDesc: "Chuyển đổi giữa các đơn vị diện tích khác nhau",
    volumeTitle: "Chuyển đổi thể tích",
    volumeDesc: "Chuyển đổi giữa các đơn vị thể tích khác nhau",
    timeTitle: "Chuyển đổi thời gian",
    timeDesc: "Chuyển đổi giữa các đơn vị thời gian khác nhau",
    speedTitle: "Chuyển đổi tốc độ",
    speedDesc: "Chuyển đổi giữa các đơn vị tốc độ khác nhau",
    inputValue: "Giá trị",
    fromUnit: "Từ đơn vị",
    toUnit: "Đến đơn vị",
    swapUnits: "Hoán đổi đơn vị",
    enterValue: "Nhập giá trị",
    converting: "Đang chuyển đổi...",
    convert: "Chuyển đổi",
    conversionResult: "Kết quả chuyển đổi",
    formula: "Công thức:",

    // Currency Converter
    currencyConverterTitle: "Chuyển Đổi Tiền Tệ",
    currencyConverterDesc: "Chuyển đổi tiền tệ giữa các loại tiền tệ khác nhau theo tỷ giá mới nhất",
    amount: "Số tiền",
    from: "Từ",
    to: "Đến",
    swapCurrencies: "Hoán đổi tiền tệ",
    enterAmount: "Nhập số tiền",
    convertCurrency: "Chuyển đổi",
    result: "Kết quả",
    exchangeRate: "Tỷ giá",
    updatedOn: "Cập nhật vào",
    loadingCurrencies: "Đang tải danh sách tiền tệ...",
    loadingRates: "Đang tải tỷ giá...",
    addToFavorites: "Thêm vào yêu thích",
    removeFromFavorites: "Xóa khỏi yêu thích",
    addToCalculator: "Thêm vào máy tính",
    favorites: "Yêu thích",
    recentConversions: "Các chuyển đổi gần đây",
    noFavorites: "Chưa có chuyển đổi yêu thích",
    noRecentConversions: "Chưa có chuyển đổi gần đây",
    historicalRates: "Tỷ giá lịch sử",
    fetchHistoricalRates: "Xem tỷ giá lịch sử",
    selectDate: "Chọn ngày",
    fetchRates: "Tải tỷ giá",
    historicalDate: "Ngày lịch sử",
    currentRate: "Tỷ giá hiện tại",
    historicalRate: "Tỷ giá lịch sử",
    rateChange: "Thay đổi",
    increaseFromHistory: "tăng từ lịch sử",
    decreaseFromHistory: "giảm từ lịch sử",
    noChange: "không thay đổi",
    multiConversion: "Đa chuyển đổi",
    calculatorResults: "Kết quả máy tính",
    noCalculations: "Chưa có chuyển đổi nào trong máy tính",
    calculatorTotal: "Tổng kết",
    totalIn: "Tổng theo",
    errorFetchingCurrencies: "Lỗi khi tải danh sách tiền tệ",
    errorFetchingExchangeRate: "Lỗi khi tải tỷ giá",
    searchCurrencies: "Tìm kiếm tiền tệ",
    
    // Mô tả các công cụ
    caseConverterDesc: "Chuyển đổi văn bản giữa chữ hoa, chữ thường và các định dạng khác",
    base64Desc: "Mã hóa và giải mã văn bản sử dụng Base64",
    hashGeneratorDesc: "Tạo các giá trị băm MD5, SHA-1, SHA-256 từ văn bản",
    characterCounterDesc: "Đếm ký tự, từ và dòng trong văn bản",
    markdownEditorDesc: "Viết markdown và xem trước kết quả theo thời gian thực",
    textDiffDesc: "So sánh hai văn bản và highlight sự khác biệt",
    jsonFormatterDesc: "Định dạng và làm đẹp mã JSON",
    regexTesterDesc: "Kiểm tra và xác nhận biểu thức chính quy",
    codeMinifierDesc: "Thu nhỏ mã JavaScript, CSS và HTML để giảm kích thước file",
    sqlFormatterDesc: "Định dạng và làm đẹp các truy vấn SQL để dễ đọc hơn",
    uuidGeneratorDesc: "Tạo các giá trị UUID v4 ngẫu nhiên",
    urlParserDesc: "Phân tích và phân tích các thành phần URL và tham số truy vấn",
    colorConverterDesc: "Chuyển đổi giữa các định dạng màu HEX, RGB, HSL",
    unitConverterDesc: "Chuyển đổi giữa các đơn vị đo lường khác nhau",
    currencyConverterDesc: "Chuyển đổi giữa các loại tiền tệ với tỷ giá mới nhất",
    passwordGeneratorDesc: "Tạo mật khẩu ngẫu nhiên, an toàn với tùy chọn tùy chỉnh",
    imageResizerDesc: "Thay đổi kích thước và nén ảnh để tối ưu hóa web",
    duplicateRemoverDesc: "Xóa các dòng trùng lặp khỏi văn bản nhanh chóng và dễ dàng",
    timestampConverterDesc: "Chuyển đổi giữa Unix timestamp và ngày/giờ dễ đọc",
    passwordStrengthDesc: "Kiểm tra độ mạnh của mật khẩu và nhận các gợi ý cải thiện",

    // Random Number Generator
    randomGeneratorTitle: "Trình tạo số ngẫu nhiên",
    randomGeneratorDesc: "Tạo các dãy số ngẫu nhiên theo phạm vi tùy chỉnh",
    minNumber: "Số tối thiểu",
    maxNumber: "Số tối đa",
    quantity: "Số lượng",
    noDuplicates: "Không trùng lặp",
    sortNumbers: "Sắp xếp kết quả",
    generateNumbers: "Tạo số ngẫu nhiên",
    generatedNumbers: "Các số đã tạo",
    copyNumbers: "Sao chép",
    numbersCopied: "Đã sao chép vào clipboard",
    
    // BMI Calculator
    bmiCalculatorTitle: "Máy tính BMI",
    bmiCalculatorDesc: "Tính chỉ số khối cơ thể (BMI) và xác định trạng thái sức khỏe",
    height: "Chiều cao",
    weight: "Cân nặng",
    calculateBMI: "Tính BMI",
    bmiResult: "Kết quả BMI",
    bmiCategory: "Phân loại",
    underweight: "Thiếu cân",
    normal: "Bình thường",
    overweight: "Thừa cân",
    obese: "Béo phì",
    metricUnits: "Hệ mét (cm, kg)",
    imperialUnits: "Hệ đo lường Anh (ft, lb)",
    gender: "Giới tính",
    male: "Nam",
    female: "Nữ",
    genderSpecificBmi: "BMI theo giới tính",
    maleCategory: "Phân loại cho Nam",
    femaleCategory: "Phân loại cho Nữ",
    maleBmiDescription: "BMI tiêu chuẩn cho nam giới: 18.5-25. Nam giới thường có tỷ lệ cơ bắp cao hơn, điều này có thể ảnh hưởng đến kết quả BMI.",
    femaleBmiDescription: "BMI tiêu chuẩn cho nữ giới: 18-24. Phụ nữ thường có tỷ lệ mỡ cơ thể cao hơn, điều này được phản ánh trong ngưỡng BMI thấp hơn.",
    
    // Word Frequency Counter
    wordFrequencyTitle: "Bộ đếm tần suất từ",
    wordFrequencyDesc: "Phân tích và đếm tần suất xuất hiện của từng từ trong văn bản",
    enterText: "Nhập văn bản",
    analyzeText: "Phân tích",
    wordFrequencyResults: "Kết quả phân tích",
    word: "Từ",
    frequency: "Tần suất",
    ignoreCommonWords: "Bỏ qua các từ phổ biến",
    caseSensitive: "Phân biệt chữ hoa/thường",
    totalWords: "Tổng số từ",
    uniqueWords: "Số từ duy nhất",
    
    // IP Address Lookup
    ipLookupTitle: "Tra cứu địa chỉ IP",
    ipLookupDesc: "Xem thông tin chi tiết về địa chỉ IP bất kỳ",
    enterIP: "Nhập địa chỉ IP",
    lookupIP: "Tra cứu",
    ipResults: "Kết quả tra cứu",
    ipAddress: "Địa chỉ IP",
    country: "Quốc gia",
    region: "Vùng",
    city: "Thành phố",
    isp: "Nhà cung cấp dịch vụ (ISP)",
    timezone: "Múi giờ",
    lookupYourIP: "Tra cứu IP của bạn",
    loading: "Đang tải...",
    errorFetching: "Lỗi khi tải dữ liệu",
    yourCurrentIp: "IP hiện tại của bạn",
    lastCheckedIp: "IP vừa tra cứu",
    ipCopied: "Đã sao chép IP",
    
    // Password Strength Checker
    passwordStrengthTitle: "Kiểm tra độ mạnh mật khẩu",
    passwordStrengthDesc: "Đánh giá mức độ bảo mật của mật khẩu và cung cấp gợi ý cải thiện",
    enterPasswordToCheck: "Nhập mật khẩu để kiểm tra",
    passwordStrength: "Độ mạnh mật khẩu",
    notRated: "Chưa đánh giá",
    veryWeak: "Rất yếu",
    weak: "Yếu",
    moderate: "Trung bình",
    strong: "Mạnh",
    veryStrong: "Rất mạnh",
    passwordCriteria: "Tiêu chí mật khẩu",
    criteriaLength: "Ít nhất 8 ký tự",
    criteriaUppercase: "Có ít nhất 1 chữ in hoa (A-Z)",
    criteriaLowercase: "Có ít nhất 1 chữ thường (a-z)",
    criteriaNumbers: "Có ít nhất 1 chữ số (0-9)",
    criteriaSpecial: "Có ít nhất 1 ký tự đặc biệt (!@#$...)",
    passwordSuggestions: "Gợi ý cải thiện",
    suggestLength: "Thêm ký tự để đạt tối thiểu 8 ký tự.",
    suggestUppercase: "Thêm ít nhất 1 chữ cái in hoa.",
    suggestLowercase: "Thêm ít nhất 1 chữ cái thường.",
    suggestNumber: "Thêm ít nhất 1 chữ số.",
    suggestSpecial: "Thêm ít nhất 1 ký tự đặc biệt như !@#$%^&*.",
    strongPasswordInfo: "Mật khẩu của bạn đã đáp ứng tất cả các tiêu chí bảo mật.",
    passwordTipsTitle: "Mẹo tạo mật khẩu mạnh",
    passwordTip1: "Tránh sử dụng thông tin cá nhân dễ đoán như tên, ngày sinh hoặc số điện thoại.",
    passwordTip2: "Không sử dụng lại mật khẩu giữa các tài khoản khác nhau.",
    passwordTip3: "Tạo cụm từ mật khẩu dài thay vì các từ đơn lẻ.",
    passwordTip4: "Cân nhắc sử dụng trình quản lý mật khẩu để lưu trữ các mật khẩu phức tạp.",
    generateStrongPassword: "Tạo mật khẩu mạnh",
    copyPassword: "Sao chép mật khẩu",
    passwordCopied: "Đã sao chép mật khẩu",
    
    // QR Code Generator/Scanner
    qrCodeTitle: "Tạo và quét mã QR",
    qrCodeDesc: "Tạo mã QR tùy chỉnh hoặc quét mã từ hình ảnh và webcam",
    generateQR: "Tạo mã QR",
    scanQR: "Quét mã QR",
    qrContentType: "Loại nội dung",
    text: "Văn bản",
    url: "Đường dẫn URL",
    contact: "Liên hệ",
    wifi: "Wifi",
    email: "Email",
    sms: "Tin nhắn SMS",
    qrTextContent: "Nội dung văn bản",
    qrTextPlaceholder: "Nhập văn bản để tạo mã QR...",
    qrUrlContent: "Đường dẫn URL",
    qrUrlPlaceholder: "Nhập đường dẫn URL (VD: example.com)...",
    qrAdvancedOptions: "Tùy chọn nâng cao",
    qrSize: "Kích thước",
    qrErrorCorrection: "Mức độ sửa lỗi",
    qrColor: "Màu mã QR",
    qrBackgroundColor: "Màu nền",
    generatingQR: "Đang tạo...",
    qrPreview: "Xem trước",
    qrPreviewPlaceholder: "Mã QR sẽ hiển thị ở đây",
    downloadQR: "Tải xuống",
    startCamera: "Mở camera",
    stopCamera: "Dừng camera",
    uploadQrImage: "Tải lên hình ảnh",
    cameraPlaceholder: "Mở camera hoặc tải lên hình ảnh để quét mã QR",
    scanResult: "Kết quả quét",
    noScanResult: "Chưa có kết quả quét",
    copyResult: "Sao chép kết quả",
    openLink: "Mở liên kết",
    copied: "Đã sao chép",
    cameraAccessError: "Không thể truy cập camera",
    noQrCodeFound: "Không tìm thấy mã QR trong hình ảnh",
    contactName: "Họ tên",
    contactNamePlaceholder: "Nhập tên...",
    contactPhone: "Số điện thoại",
    contactPhonePlaceholder: "Nhập số điện thoại...",
    contactEmail: "Email",
    contactEmailPlaceholder: "Nhập địa chỉ email...",
    contactCompany: "Công ty",
    contactCompanyPlaceholder: "Nhập tên công ty...",
    contactTitle: "Chức vụ",
    contactTitlePlaceholder: "Nhập chức vụ...",
    contactWebsite: "Website",
    contactWebsitePlaceholder: "Nhập đường dẫn website...",
    contactAddress: "Địa chỉ",
    contactAddressPlaceholder: "Nhập địa chỉ...",
    wifiSSID: "Tên mạng (SSID)",
    wifiSSIDPlaceholder: "Nhập tên mạng wifi...",
    wifiPassword: "Mật khẩu",
    wifiPasswordPlaceholder: "Nhập mật khẩu wifi...",
    wifiEncryption: "Loại bảo mật",
    wifiNoPassword: "Không mật khẩu",
    wifiHidden: "Mạng ẩn",
    emailAddress: "Địa chỉ email",
    emailAddressPlaceholder: "Nhập địa chỉ email...",
    emailSubject: "Tiêu đề",
    emailSubjectPlaceholder: "Nhập tiêu đề email...",
    emailBody: "Nội dung",
    emailBodyPlaceholder: "Nhập nội dung email...",
    smsPhone: "Số điện thoại",
    smsPhonePlaceholder: "Nhập số điện thoại...",
    smsMessage: "Tin nhắn",
    smsMessagePlaceholder: "Nhập nội dung tin nhắn...",

    // Calendar Date Calculator
    dateCalculatorTitle: "Máy tính ngày tháng",
    dateCalculatorDesc: "Tính toán khoảng cách giữa các ngày hoặc thêm/trừ ngày từ một ngày cụ thể",
    dateCalculatorSubDesc: "Công cụ tính toán thời gian giữa hai ngày hoặc ngày sau một khoảng thời gian nhất định",
    dateOperations: "Thao tác với ngày",
    dateDifference: "Tính khoảng cách ngày",
    dateAddSubtract: "Thêm/Trừ ngày",
    calculateDiff: "Tính khoảng cách",
    days: "Ngày",
    months: "Tháng",
    years: "Năm",
    startDate: "Ngày bắt đầu",
    endDate: "Ngày kết thúc",
    resultDays: "Ngày",
    resultMonths: "Tháng",
    resultYears: "Năm",
    resultHours: "Giờ",
    resultMinutes: "Phút",
    includeEndDate: "Bao gồm ngày kết thúc",
    excludeWeekends: "Không tính cuối tuần",
    addDays: "Thêm ngày",
    subtractDays: "Trừ ngày",
    addWorkdays: "Thêm ngày làm việc",
    subtractWorkdays: "Trừ ngày làm việc",
    daysToAdd: "Số ngày cần thêm",
    daysToSubtract: "Số ngày cần trừ",
    businessDays: "Ngày làm việc",
    dateResult: "Kết quả",
    
    // CSV Viewer/Editor
    csvViewerTitle: "Trình đọc/chỉnh sửa CSV",
    csvViewerDesc: "Đọc, xem, chỉnh sửa và phân tích dữ liệu CSV trực tuyến",
    uploadCsv: "Tải lên tệp CSV",
    orPasteCsv: "hoặc dán dữ liệu CSV",
    delimiter: "Dấu phân cách",
    displayOptions: "Tùy chọn hiển thị",
    firstRowHeader: "Dòng đầu là tiêu đề",
    fixedHeader: "Tiêu đề cố định",
    darkRows: "Dòng tối",
    showLineNumbers: "Hiển thị số dòng",
    export: "Xuất",
    exportAsCsv: "Xuất dạng CSV",
    exportAsJson: "Xuất dạng JSON",
    exportAsExcel: "Xuất dạng Excel",
    editCell: "Chỉnh sửa ô",
    deleteRow: "Xóa dòng",
    addRow: "Thêm dòng",
    filter: "Lọc",
    sort: "Sắp xếp",
    search: "Tìm kiếm",
    searchPlaceholder: "Tìm kiếm trong dữ liệu...",
    noDataFound: "Không tìm thấy dữ liệu",
    processing: "Đang xử lý...",
    dropCsvHere: "Kéo tệp CSV vào đây",
    rowCount: "Số dòng",
    columnCount: "Số cột",
    csvLoaded: "Đã tải CSV",
    clearData: "Xóa dữ liệu"
  },
  en: {
    // Header section
    toggleTheme: "Toggle Theme",
    toggleLanguage: "Chuyển sang Tiếng Việt",

    // Home page
    developerTools: "Developer Tools",
    toolsCollection: "A collection of useful tools to help you work more efficiently",
    useButton: "Use →",

    // Sidebar section
    textTools: "Text Tools",
    codeTools: "Code Tools",
    otherTools: "Other Tools",

    // Footer
    copyright: "© 2025 michis. All rights reserved.",

    // Unit Converter
    unitConverterTitle: "Unit Converter",
    unitConverterDesc: "Convert between different units of measurement",
    unitConverterSubDesc: "Convert between different units of the same measurement type",
    length: "Length",
    weight: "Weight",
    temperature: "Temperature",
    area: "Area",
    volume: "Volume",
    time: "Time",
    speed: "Speed",
    lengthTitle: "Length Conversion",
    lengthDesc: "Convert between different length units",
    weightTitle: "Weight Conversion",
    weightDesc: "Convert between different weight units",
    temperatureTitle: "Temperature Conversion",
    temperatureDesc: "Convert between different temperature units",
    areaTitle: "Area Conversion",
    areaDesc: "Convert between different area units",
    volumeTitle: "Volume Conversion",
    volumeDesc: "Convert between different volume units",
    timeTitle: "Time Conversion",
    timeDesc: "Convert between different time units",
    speedTitle: "Speed Conversion",
    speedDesc: "Convert between different speed units",
    inputValue: "Value",
    fromUnit: "From Unit",
    toUnit: "To Unit",
    swapUnits: "Swap Units",
    enterValue: "Enter value",
    converting: "Converting...",
    convert: "Convert",
    conversionResult: "Conversion Result",
    formula: "Formula:",

    // Currency Converter
    currencyConverterTitle: "Currency Converter",
    currencyConverterDesc: "Convert between different currencies using the latest exchange rates",
    amount: "Amount",
    from: "From",
    to: "To",
    swapCurrencies: "Swap Currencies",
    enterAmount: "Enter amount",
    convertCurrency: "Convert",
    result: "Result",
    exchangeRate: "Exchange Rate",
    updatedOn: "Updated on",
    loadingCurrencies: "Loading currencies...",
    loadingRates: "Loading exchange rates...",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",
    addToCalculator: "Add to Calculator",
    favorites: "Favorites",
    recentConversions: "Recent Conversions",
    noFavorites: "No favorite conversions yet",
    noRecentConversions: "No recent conversions",
    historicalRates: "Historical Rates",
    fetchHistoricalRates: "View Historical Rates",
    selectDate: "Select Date",
    fetchRates: "Fetch Rates",
    historicalDate: "Historical Date",
    currentRate: "Current Rate",
    historicalRate: "Historical Rate",
    rateChange: "Change",
    increaseFromHistory: "increase from history",
    decreaseFromHistory: "decrease from history",
    noChange: "no change",
    multiConversion: "Multi Conversion",
    calculatorResults: "Calculator Results",
    noCalculations: "No calculations in the calculator yet",
    calculatorTotal: "Calculator Total",
    totalIn: "Total in",
    errorFetchingCurrencies: "Error fetching currencies",
    errorFetchingExchangeRate: "Error fetching exchange rate",
    searchCurrencies: "Search currencies",
    
    // Tool descriptions
    caseConverterDesc: "Convert text between uppercase, lowercase, and other formats",
    base64Desc: "Encode and decode text using Base64",
    hashGeneratorDesc: "Generate MD5, SHA-1, SHA-256 hashes from text",
    characterCounterDesc: "Count characters, words, and lines in text",
    markdownEditorDesc: "Write markdown and see the preview in real-time",
    textDiffDesc: "Compare two texts and highlight the differences",
    jsonFormatterDesc: "Format and beautify JSON code",
    regexTesterDesc: "Test and validate regular expressions",
    codeMinifierDesc: "Minify JavaScript, CSS, and HTML code to reduce file size",
    sqlFormatterDesc: "Format and beautify SQL queries for better readability",
    uuidGeneratorDesc: "Generate random UUID v4 values",
    urlParserDesc: "Parse and analyze URL components and query parameters",
    colorConverterDesc: "Convert between HEX, RGB, HSL color formats",
    unitConverterDesc: "Convert between different units of measurement",
    currencyConverterDesc: "Convert between currencies using the latest exchange rates",
    passwordGeneratorDesc: "Generate secure, random passwords with custom options",
    imageResizerDesc: "Resize and compress images for web optimization",
    duplicateRemoverDesc: "Remove duplicate lines from text quickly and easily",
    timestampConverterDesc: "Convert between Unix timestamp and human-readable date/time",
    passwordStrengthDesc: "Check your password strength and get improvement tips",

    // Random Number Generator
    randomGeneratorTitle: "Random Number Generator",
    randomGeneratorDesc: "Generate random number sequences within a custom range",
    minNumber: "Minimum Number",
    maxNumber: "Maximum Number",
    quantity: "Quantity",
    noDuplicates: "No Duplicates",
    sortNumbers: "Sort Results",
    generateNumbers: "Generate Random Numbers",
    generatedNumbers: "Generated Numbers",
    copyNumbers: "Copy",
    numbersCopied: "Copied to clipboard",
    
    // BMI Calculator
    bmiCalculatorTitle: "BMI Calculator",
    bmiCalculatorDesc: "Calculate Body Mass Index (BMI) and determine health status",
    height: "Height",
    weight: "Weight",
    calculateBMI: "Calculate BMI",
    bmiResult: "BMI Result",
    bmiCategory: "Category",
    underweight: "Underweight",
    normal: "Normal",
    overweight: "Overweight",
    obese: "Obese",
    metricUnits: "Metric Units (cm, kg)",
    imperialUnits: "Imperial Units (ft, lb)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    genderSpecificBmi: "Gender-Specific BMI",
    maleCategory: "Category for Male",
    femaleCategory: "Category for Female",
    maleBmiDescription: "BMI standard for men: 18.5-25. Men typically have a higher muscle-to-fat ratio, which can affect BMI results.",
    femaleBmiDescription: "BMI standard for women: 18-24. Women typically have a higher body fat ratio, which is reflected in a lower BMI range.",
    
    // Word Frequency Counter
    wordFrequencyTitle: "Word Frequency Counter",
    wordFrequencyDesc: "Analyze and count the frequency of each word in a text",
    enterText: "Enter Text",
    analyzeText: "Analyze",
    wordFrequencyResults: "Analysis Results",
    word: "Word",
    frequency: "Frequency",
    ignoreCommonWords: "Ignore Common Words",
    caseSensitive: "Case Sensitive",
    totalWords: "Total Words",
    uniqueWords: "Unique Words",
    
    // IP Address Lookup
    ipLookupTitle: "IP Address Lookup",
    ipLookupDesc: "View detailed information about any IP address",
    enterIP: "Enter IP Address",
    lookupIP: "Lookup",
    ipResults: "Lookup Results",
    ipAddress: "IP Address",
    country: "Country",
    region: "Region",
    city: "City",
    isp: "ISP",
    timezone: "Timezone",
    lookupYourIP: "Lookup Your IP",
    loading: "Loading...",
    errorFetching: "Error fetching data",
    yourCurrentIp: "Your Current IP",
    lastCheckedIp: "Last Checked IP",
    ipCopied: "IP Copied",
    
    // Password Strength Checker
    passwordStrengthTitle: "Password Strength Checker",
    passwordStrengthDesc: "Evaluate your password security level and get improvement tips",
    enterPasswordToCheck: "Enter password to check",
    passwordStrength: "Password Strength",
    notRated: "Not Rated",
    veryWeak: "Very Weak",
    weak: "Weak",
    moderate: "Moderate",
    strong: "Strong",
    veryStrong: "Very Strong",
    passwordCriteria: "Password Criteria",
    criteriaLength: "At least 8 characters",
    criteriaUppercase: "Contains uppercase letter (A-Z)",
    criteriaLowercase: "Contains lowercase letter (a-z)",
    criteriaNumbers: "Contains number (0-9)",
    criteriaSpecial: "Contains special character (!@#$...)",
    passwordSuggestions: "Improvement Suggestions",
    suggestLength: "Add more characters to reach at least 8 characters.",
    suggestUppercase: "Add at least one uppercase letter.",
    suggestLowercase: "Add at least one lowercase letter.",
    suggestNumber: "Add at least one number.",
    suggestSpecial: "Add at least one special character like !@#$%^&*.",
    strongPasswordInfo: "Your password meets all security criteria.",
    passwordTipsTitle: "Tips for Strong Passwords",
    passwordTip1: "Avoid using easily guessable personal information like names, birthdates, or phone numbers.",
    passwordTip2: "Don't reuse passwords across different accounts.",
    passwordTip3: "Create longer passphrases instead of single words.",
    passwordTip4: "Consider using a password manager to store complex passwords.",
    generateStrongPassword: "Generate Strong Password",
    copyPassword: "Copy Password",
    passwordCopied: "Password Copied",
    
    // QR Code Generator/Scanner
    qrCodeTitle: "QR Code Generator & Scanner",
    qrCodeDesc: "Create custom QR codes or scan codes from images and webcam",
    generateQR: "Generate QR",
    scanQR: "Scan QR",
    qrContentType: "Content Type",
    text: "Text",
    url: "URL",
    contact: "Contact",
    wifi: "Wifi",
    email: "Email",
    sms: "SMS",
    qrTextContent: "Text Content",
    qrTextPlaceholder: "Enter text to generate QR code...",
    qrUrlContent: "URL",
    qrUrlPlaceholder: "Enter URL (e.g. example.com)...",
    qrAdvancedOptions: "Advanced Options",
    qrSize: "Size",
    qrErrorCorrection: "Error Correction",
    qrColor: "QR Color",
    qrBackgroundColor: "Background Color",
    generatingQR: "Generating...",
    qrPreview: "Preview",
    qrPreviewPlaceholder: "QR code will be displayed here",
    downloadQR: "Download",
    startCamera: "Start Camera",
    stopCamera: "Stop Camera",
    uploadQrImage: "Upload Image",
    cameraPlaceholder: "Start camera or upload an image to scan QR code",
    scanResult: "Scan Result",
    noScanResult: "No scan result yet",
    copyResult: "Copy Result",
    openLink: "Open Link",
    copied: "Copied",
    cameraAccessError: "Cannot access camera",
    noQrCodeFound: "No QR code found in image",
    contactName: "Name",
    contactNamePlaceholder: "Enter name...",
    contactPhone: "Phone",
    contactPhonePlaceholder: "Enter phone number...",
    contactEmail: "Email",
    contactEmailPlaceholder: "Enter email address...",
    contactCompany: "Company",
    contactCompanyPlaceholder: "Enter company name...",
    contactTitle: "Job Title",
    contactTitlePlaceholder: "Enter job title...",
    contactWebsite: "Website",
    contactWebsitePlaceholder: "Enter website URL...",
    contactAddress: "Address",
    contactAddressPlaceholder: "Enter address...",
    wifiSSID: "Network Name (SSID)",
    wifiSSIDPlaceholder: "Enter wifi network name...",
    wifiPassword: "Password",
    wifiPasswordPlaceholder: "Enter wifi password...",
    wifiEncryption: "Security Type",
    wifiNoPassword: "No Password",
    wifiHidden: "Hidden Network",
    emailAddress: "Email Address",
    emailAddressPlaceholder: "Enter email address...",
    emailSubject: "Subject",
    emailSubjectPlaceholder: "Enter email subject...",
    emailBody: "Body",
    emailBodyPlaceholder: "Enter email body...",
    smsPhone: "Phone Number",
    smsPhonePlaceholder: "Enter phone number...",
    smsMessage: "Message",
    smsMessagePlaceholder: "Enter message content...",

    // Calendar Date Calculator
    dateCalculatorTitle: "Date Calculator",
    dateCalculatorDesc: "Calculate duration between dates or add/subtract days from a specific date",
    dateCalculatorSubDesc: "A tool to calculate time between two dates or date after a certain duration",
    dateOperations: "Date Operations",
    dateDifference: "Date Difference",
    dateAddSubtract: "Add/Subtract Days",
    calculateDiff: "Calculate Difference",
    days: "Days",
    months: "Months",
    years: "Years",
    startDate: "Start Date",
    endDate: "End Date",
    resultDays: "Days",
    resultMonths: "Months",
    resultYears: "Years",
    resultHours: "Hours",
    resultMinutes: "Minutes",
    includeEndDate: "Include End Date",
    excludeWeekends: "Exclude Weekends",
    addDays: "Add Days",
    subtractDays: "Subtract Days",
    addWorkdays: "Add Workdays",
    subtractWorkdays: "Subtract Workdays",
    daysToAdd: "Days to Add",
    daysToSubtract: "Days to Subtract",
    businessDays: "Business Days",
    dateResult: "Result",
    
    // CSV Viewer/Editor
    csvViewerTitle: "CSV Viewer/Editor",
    csvViewerDesc: "Read, view, edit and analyze CSV data online",
    uploadCsv: "Upload CSV File",
    orPasteCsv: "or paste CSV data",
    delimiter: "Delimiter",
    displayOptions: "Display Options",
    firstRowHeader: "First Row as Header",
    fixedHeader: "Fixed Header",
    darkRows: "Dark Rows",
    showLineNumbers: "Show Line Numbers",
    export: "Export",
    exportAsCsv: "Export as CSV",
    exportAsJson: "Export as JSON",
    exportAsExcel: "Export as Excel",
    editCell: "Edit Cell",
    deleteRow: "Delete Row",
    addRow: "Add Row",
    filter: "Filter",
    sort: "Sort",
    search: "Search",
    searchPlaceholder: "Search in data...",
    noDataFound: "No data found",
    processing: "Processing...",
    dropCsvHere: "Drop CSV file here",
    rowCount: "Row Count",
    columnCount: "Column Count",
    csvLoaded: "CSV Loaded",
    clearData: "Clear Data"
  }
};

// Tạo provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi');

  // Kiểm tra và tải ngôn ngữ đã lưu khi component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Cập nhật localStorage khi ngôn ngữ thay đổi
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Chuyển đổi giữa tiếng Việt và tiếng Anh
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  // Lấy tất cả các text của ngôn ngữ hiện tại
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 