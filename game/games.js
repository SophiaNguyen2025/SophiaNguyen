/* Nội dung các trò chơi. Mỗi trò = 1 nhân vật + 6 trạm + các kiểu kết quả + 1 bài test để dẫn về.
   Sửa chữ ở đây, không cần đụng vào engine.js. */
(function (root) {
  var L = { s: 'Điểm mạnh', p: 'Khi áp lực', f: 'Hợp với' };

  var G = {};

  /* ---------------------------------------------------------------- MẦM → DISC */
  G.mam = {
    id: 'mam', url: '/hanh-trinh-cua-mam', hud: 'Hành trình của Mầm', thumb: 'Mầm, hạt mầm đi tìm loài hoa của mình',
    leadsTo: 'Dẫn tới bài test DISC', seoTitle: 'Hành trình của Mầm | Trò chơi tính cách',
    seoDesc: 'Trò chơi 1 phút: chọn thay Mầm qua 6 tình huống, xem Mầm nở thành loài hoa nào. Sophia Nguyễn.',
    title: 'Mầm sẽ nở thành loài hoa nào?', sub: 'Sáu trạm, sáu lựa chọn. Bạn chọn thay Mầm, bình minh sẽ lên theo từng bước.',
    char: { kind: 'sprout', rewardY: 4, rewardScale: 1.2 },
    sky: [['#14213D', '#24456E'], ['#1C2B52', '#3C568A'], ['#3A3566', '#7A6A9E'], ['#6B5B95', '#C98FA0'], ['#A56E9A', '#F0A488'], ['#E49A8C', '#FBCB9A'], ['#8EC5E8', '#FFE9C7']],
    hills: { far: ['#2B4A6F', '#8DC9A6'], near: ['#1D3557', '#69B57F'], ground: ['#10293B', '#356A40'] },
    sunUp: [-30, -24, -14, -4, 10, 20, 28], stars: [1, .9, .6, .35, .12, 0, 0], celestial: 'sun',
    stations: [
      { name: 'Ngã ba sương', say: 'Mầm đến một ngã ba. Tấm biển chỉ đường đã mờ hết chữ. Mầm làm gì?', o: [
        { k: 'D', t: 'Chọn đại một hướng và đi trước, sai thì quay lại sửa.' },
        { k: 'K', t: 'Hỏi những người cùng đường xem ai muốn đi hướng nào.' },
        { k: 'G', t: 'Ngồi nghỉ, chờ cả nhóm đông đủ rồi cùng đi một nhịp.' },
        { k: 'Q', t: 'Lấy bản đồ ra, so từng nhánh rồi mới bước.' }] },
      { name: 'Bạn Dế lạc nhóm', say: 'Bên đường, bạn Dế đang ngồi khóc vì lạc mất nhóm.', o: [
        { k: 'D', t: 'Nói ngay: “Đi theo Mầm, Mầm đưa bạn về!”' },
        { k: 'K', t: 'Ngồi xuống cạnh bạn, nghe bạn kể cho hết.' },
        { k: 'G', t: 'Đưa bạn ít nước, ở bên đến khi bạn bình tĩnh lại.' },
        { k: 'Q', t: 'Hỏi bạn đã đi qua những đâu để cùng lần lại dấu chân.' }] },
      { name: 'Cầu gỗ cũ', say: 'Cây cầu gỗ kêu cọt kẹt. Trời sắp tối, mà bờ bên kia mới có chỗ ngủ.', o: [
        { k: 'D', t: 'Bước qua luôn. Cầu chưa gãy thì cứ đi.' },
        { k: 'K', t: 'Rủ cả nhóm nắm tay nhau, qua từng người một.' },
        { k: 'G', t: 'Qua thật chậm, chắc từng bước, không vội.' },
        { k: 'Q', t: 'Gõ thử từng tấm ván trước khi đặt chân.' }] },
      { name: 'Cơn mưa', say: 'Mưa ập xuống, kế hoạch hôm nay đổ vỡ hết.', o: [
        { k: 'D', t: 'Đổi kế hoạch ngay, tìm đường khác để vẫn tới nơi.' },
        { k: 'K', t: 'Rủ mọi người trú chung một tán lá và kể chuyện cho vui.' },
        { k: 'G', t: 'Nghỉ một chút. Mưa tạnh rồi tính tiếp.' },
        { k: 'Q', t: 'Ngồi nghĩ xem điều gì đã sai để lần sau tính trước.' }] },
      { name: 'Lễ hội làng', say: 'Làng đang mở hội. Người ta mời Mầm lên sân khấu nói vài lời.', o: [
        { k: 'D', t: 'Bước lên liền, cầm micro nói điều mình muốn.' },
        { k: 'K', t: 'Lên và kéo thêm vài người bạn lên cùng.' },
        { k: 'G', t: 'Nhường người khác trước, Mầm đứng phụ phía sau.' },
        { k: 'Q', t: 'Xin ít phút chuẩn bị, viết ý chính ra rồi mới lên.' }] },
      { name: 'Đỉnh đồi', say: 'Mầm lên tới đỉnh đồi, đúng lúc bình minh. Mầm muốn làm gì nhất?', o: [
        { k: 'D', t: 'Nhìn xuống con đường phía trước và nghĩ xem sẽ chinh phục gì tiếp.' },
        { k: 'K', t: 'Gọi mọi người lại, cùng ngắm và cùng cười.' },
        { k: 'G', t: 'Ngồi yên tận hưởng. Thấy bình an là đủ.' },
        { k: 'Q', t: 'Ghi lại những điều mình học được trên đường.' }] }
    ],
    lead: 'Mầm nở thành', labels: L,
    types: {
      D: { name: 'Hoa Hướng Dương', who: 'Người Dẫn Đường', shape: { kind: 'petals', n: 16, rx: 5, ry: 15, d: 20, c: '#F5B82E', c2: '#E39B14', core: '#7A4B1E', r: 11 },
        s: 'Dám bắt đầu, quyết nhanh, kéo được cả nhóm đi tiếp.', p: 'Dễ nóng vội và quên hỏi người khác đang cảm thấy thế nào.', f: 'Những việc cần người đứng ra khởi động và chịu trách nhiệm.' },
      K: { name: 'Hoa Đào', who: 'Người Kết Nối', shape: { kind: 'petals', n: 5, rx: 14, ry: 15, d: 16, c: '#F7A8C0', c2: '#EE86A6', core: '#FFE08A', r: 8 },
        s: 'Nhạy với cảm xúc, giỏi làm quen và gắn mọi người lại với nhau.', p: 'Dễ ôm việc của người khác và ngại nói “không”.', f: 'Những việc cần giao tiếp, truyền cảm hứng, làm việc với con người.' },
      G: { name: 'Hoa Lưu Ly', who: 'Người Giữ Nhịp', shape: { kind: 'petals', n: 6, rx: 11, ry: 14, d: 16, c: '#8FB8F2', c2: '#6F9BE0', core: '#FFE9A6', r: 7 },
        s: 'Kiên nhẫn, đáng tin, giữ cho nhóm bình tĩnh khi mọi thứ rối.', p: 'Dễ ngại thay đổi và nuốt điều mình muốn vào trong.', f: 'Những việc cần sự bền bỉ, chăm sóc và đồng hành lâu dài.' },
      Q: { name: 'Hoa Oải Hương', who: 'Người Quan Sát', shape: { kind: 'petals', n: 9, rx: 5.5, ry: 17, d: 18, c: '#B79CE8', c2: '#9877D6', core: '#F3E7FF', r: 7 },
        s: 'Cẩn thận, nhìn ra chi tiết người khác bỏ sót, quyết định có cơ sở.', p: 'Dễ nghĩ quá lâu và đòi mình phải thật hoàn hảo.', f: 'Những việc cần phân tích, lên kế hoạch, kiểm tra chất lượng.' }
    },
    note: 'Trò chơi vui, không phải công cụ đánh giá. Muốn hiểu mình bằng bài test chuẩn hơn thì làm bài miễn phí dưới đây.',
    cta: { label: 'Làm bài test DISC miễn phí', href: '/testDISC' }
  };

  /* ---------------------------------------------------------------- CÁO → HOLLAND / TEST NGHỀ NGHIỆP */
  G.cao = {
    id: 'cao', url: '/cao-con-o-cho-phien', hud: 'Cáo Con ở chợ phiên', thumb: 'Cáo Con, đi chợ phiên tìm gian hàng hợp mình',
    leadsTo: 'Dẫn tới bài test nghề nghiệp', seoTitle: 'Cáo Con ở chợ phiên | Trò chơi định hướng nghề nghiệp',
    seoDesc: 'Trò chơi 1 phút: Cáo Con đi chợ phiên, bạn chọn gian hàng thay Cáo và xem mình hợp môi trường làm việc nào. Sophia Nguyễn.',
    title: 'Cáo Con sẽ chọn gian hàng nào?', sub: 'Sáu trạm trong một ngày chợ phiên. Mỗi lựa chọn cho thấy bạn thích làm việc theo kiểu nào.',
    char: { kind: 'fox', rewardY: 14, rewardScale: 1 },
    sky: [['#9ED6EE', '#FDEFD2'], ['#8FD0F0', '#FFF6DC'], ['#7EC8F0', '#FFFBEA'], ['#8CCBEA', '#FFEFC8'], ['#F2B880', '#FFE0A8'], ['#F59E6C', '#FFD39B'], ['#F08A6A', '#FFC98F']],
    hills: { far: ['#9CCFA3', '#B8A07A'], near: ['#7DBB8B', '#9C8A5E'], ground: ['#4A8F5E', '#6E6A45'] },
    sunUp: [-26, -12, 2, 14, 26, 34, 22], stars: [0, 0, 0, 0, 0, 0, 0], celestial: 'sun',
    stations: [
      { name: 'Cổng chợ', say: 'Cáo Con đến cổng chợ phiên, bốn gian hàng đang vẫy gọi. Cáo ghé gian nào trước?', o: [
        { k: 'R', t: 'Gian đồ nghề, nơi mọi thứ đều có thể tự tay lắp ráp.' },
        { k: 'I', t: 'Gian kính hiển vi, nơi ai cũng đang đố nhau câu hỏi khó.' },
        { k: 'A', t: 'Gian màu sắc và nhạc cụ, tiếng đàn vang khắp lối.' },
        { k: 'S', t: 'Quán trà, nơi mọi người ngồi trò chuyện với nhau.' }] },
      { name: 'Mái che bị sập', say: 'Một gian hàng bị sập mái che đúng lúc đông khách. Cáo giúp bằng cách nào?', o: [
        { k: 'R', t: 'Leo lên sửa mái ngay bằng đồ nghề.' },
        { k: 'S', t: 'Trấn an khách, dìu mọi người sang chỗ khác.' },
        { k: 'E', t: 'Đứng ra điều phối, chia người, chia việc cho từng gian.' },
        { k: 'C', t: 'Lấy sổ ghi lại thiệt hại và liên hệ nơi sửa chữa.' }] },
      { name: 'Đố vui chợ phiên', say: 'Chủ chợ treo giải cho ai giải được câu đố khó. Cáo thấy hứng thú ở điểm nào?', o: [
        { k: 'I', t: 'Bóc từng lớp câu đố để hiểu vì sao nó khó.' },
        { k: 'A', t: 'Nghĩ ra cách giải thật lạ mà chưa ai nghĩ tới.' },
        { k: 'E', t: 'Rủ nhóm lập đội và dẫn dắt cả đội đi thi.' },
        { k: 'C', t: 'Làm theo từng bước có sẵn cho chắc ăn.' }] },
      { name: 'Quầy của Cáo', say: 'Cáo được mượn một quầy để bán thử đồ của mình.', o: [
        { k: 'A', t: 'Trang trí quầy thật độc đáo, mỗi món một câu chuyện.' },
        { k: 'E', t: 'Nghĩ cách giới thiệu để khách tin và mua nhiều.' },
        { k: 'S', t: 'Chỉ cho khách cách dùng, ai cần thì tặng thêm.' },
        { k: 'R', t: 'Làm thêm đồ mới ngay tại quầy cho khách xem.' }] },
      { name: 'Cuối ngày', say: 'Chủ chợ nhờ Cáo giúp việc cuối ngày. Việc nào làm Cáo thấy dễ chịu nhất?', o: [
        { k: 'C', t: 'Kiểm kê hàng, đối chiếu sổ cho khớp từng con số.' },
        { k: 'I', t: 'Tìm xem vì sao hôm nay món này bán chạy mà món kia thì không.' },
        { k: 'S', t: 'Hỏi han từng người bán xem hôm nay họ có ổn không.' },
        { k: 'R', t: 'Thu dọn, khuân vác, sửa lại các quầy cho gọn.' }] },
      { name: 'Hoàng hôn trên chợ', say: 'Chợ sắp đóng cửa. Cáo muốn nhớ lại ngày hôm nay vì điều gì?', o: [
        { k: 'E', t: 'Mình đã thuyết phục được nhiều người.' },
        { k: 'C', t: 'Mình đã làm xong mọi việc đúng kế hoạch.' },
        { k: 'I', t: 'Mình đã hiểu thêm một điều mới.' },
        { k: 'A', t: 'Mình đã tạo ra thứ đẹp, của riêng mình.' }] }
    ],
    lead: 'Gian hàng của bạn', labels: { s: 'Điểm mạnh', p: 'Dễ gặp', f: 'Nhóm nghề thường gặp' },
    types: {
      R: { name: 'Xưởng Thợ Khéo', who: 'Cáo thích làm bằng tay', shape: { kind: 'gear', n: 8, r: 17, c: '#E58A3A', core: '#FFF1DC' },
        s: 'Thực tế, khéo tay, thích thấy việc mình làm ra kết quả cụ thể.', p: 'Chán khi phải ngồi họp, nói nhiều mà chưa làm gì.', f: 'Kỹ thuật, cơ khí, xây dựng, nông nghiệp, chế tác, vận hành thiết bị.' },
      I: { name: 'Phòng Thám Hiểm', who: 'Cáo tò mò tìm hiểu', shape: { kind: 'sparkle', c: '#5CA8E6', core: '#E8F4FF' },
        s: 'Tò mò, phân tích sâu, thích hiểu vì sao mọi thứ vận hành như vậy.', p: 'Dễ chìm vào suy nghĩ và ngại những việc lặp đi lặp lại.', f: 'Nghiên cứu, phân tích dữ liệu, y sinh, công nghệ thông tin, khoa học.' },
      A: { name: 'Xưởng Sáng Tạo', who: 'Cáo nhiều ý tưởng', shape: { kind: 'petals', n: 7, rx: 9, ry: 14, d: 16, c: '#F08AB0', c2: '#E2639A', core: '#FFE08A', r: 7 },
        s: 'Giàu ý tưởng, nhạy với cái đẹp, thích làm theo cách của riêng mình.', p: 'Khó chịu với quy trình quá cứng và những việc bị bó chặt.', f: 'Thiết kế, nội dung, nghệ thuật, truyền thông, kiến trúc, sáng tạo.' },
      S: { name: 'Quán Trà Sẻ Chia', who: 'Cáo thích giúp người', shape: { kind: 'heart', c: '#F0707A', core: '#FFE3E3' },
        s: 'Ấm áp, biết lắng nghe, thích thấy người khác tốt lên nhờ mình.', p: 'Dễ kiệt sức khi ôm hết nhu cầu của người khác.', f: 'Giáo dục, tham vấn, chăm sóc sức khỏe, công tác xã hội, nhân sự.' },
      E: { name: 'Quầy Thương Lượng', who: 'Cáo thích dẫn dắt', shape: { kind: 'star', n: 5, r1: 27, r2: 12, c: '#F5B82E', core: '#FFF3C4' },
        s: 'Chủ động, thuyết phục tốt, dám nhận mục tiêu và dẫn người khác theo.', p: 'Dễ sốt ruột với người chậm và việc nhiều chi tiết.', f: 'Kinh doanh, bán hàng, quản lý, khởi nghiệp, marketing, đàm phán.' },
      C: { name: 'Văn Phòng Ngăn Nắp', who: 'Cáo thích trật tự', shape: { kind: 'hex', c: '#6FA7A0', c2: '#4F8780', core: '#E5F5F2' },
        s: 'Cẩn thận, đáng tin, giữ mọi thứ chính xác và đúng hạn.', p: 'Căng thẳng khi kế hoạch bị đổi liên tục.', f: 'Kế toán, hành chính, ngân hàng, kiểm toán, quản lý dữ liệu, vận hành.' }
    },
    note: 'Trò chơi vui, chỉ gợi ý hướng. Bài test Holland RIASEC đầy đủ cho bạn nhóm ba chữ cái, kèm gợi ý nhóm nghề cụ thể và miễn phí.',
    cta: { label: 'Làm bài test nghề nghiệp miễn phí', href: '/testnghenghiep' }
  };

  /* ---------------------------------------------------------------- CÚ MÈO → PHONG CÁCH HỌC TẬP */
  G.cu = {
    id: 'cu', url: '/cu-meo-dem-on-thi', hud: 'Cú Mèo đêm ôn thi', thumb: 'Cú Mèo, đêm trước kỳ thi',
    leadsTo: 'Dẫn tới bài test phong cách học tập', seoTitle: 'Cú Mèo đêm ôn thi | Trò chơi phong cách học tập',
    seoDesc: 'Trò chơi 1 phút cho học sinh, sinh viên: Cú Mèo ôn thi, bạn chọn thay Cú và xem mình học tốt nhất bằng tai, mắt hay tay chân. Sophia Nguyễn.',
    title: 'Bạn học tốt nhất bằng tai, mắt hay tay chân?', sub: 'Cú Mèo có một đêm ôn thi dài. Bạn chọn cách học thay Cú.',
    char: { kind: 'owl', rewardY: 16, rewardScale: 1 },
    sky: [['#0C1633', '#1B2A55'], ['#0F1B3D', '#223364'], ['#142247', '#2B3F7A'], ['#1A2A55', '#35508F'], ['#2A3A6E', '#5A6FA8'], ['#4A4F85', '#B68FA6'], ['#6F6AA3', '#F2B38B']],
    hills: { far: ['#233560', '#4D6F9A'], near: ['#192A4E', '#3C5F7F'], ground: ['#0E1B36', '#27425A'] },
    sunUp: [-26, -8, 10, 22, 30, 30, 26], stars: [1, 1, 1, .9, .6, .3, .1], celestial: 'moon',
    stations: [
      { name: 'Mở sách', say: 'Đêm trước kỳ thi, Cú Mèo ngồi trước một chương sách dày. Cú bắt đầu thế nào?', o: [
        { k: 'V', t: 'Vẽ sơ đồ, tô màu các ý chính cho dễ nhìn.' },
        { k: 'T', t: 'Đọc to thành tiếng và nghe lại giọng mình.' },
        { k: 'M', t: 'Đứng dậy, vừa đi vừa nhẩm từng ý.' }] },
      { name: 'Danh sách dài', say: 'Cú cần nhớ một danh sách mười thuật ngữ.', o: [
        { k: 'V', t: 'Hình dung mỗi thuật ngữ thành một hình ảnh trong đầu.' },
        { k: 'T', t: 'Biến chúng thành một bài vè hoặc điệu hát.' },
        { k: 'M', t: 'Viết lên thẻ rồi xếp đi xếp lại cho nhớ.' }] },
      { name: 'Bạn Sẻ nhờ giảng', say: 'Bạn Sẻ nhờ Cú giải thích một bài khó.', o: [
        { k: 'V', t: 'Lấy giấy ra vẽ sơ đồ cho bạn xem.' },
        { k: 'T', t: 'Giảng bằng lời, rồi hỏi lại để bạn nhắc lại.' },
        { k: 'M', t: 'Làm thử một ví dụ cùng bạn, từng bước một.' }] },
      { name: 'Tiếng ồn ngoài cửa sổ', say: 'Có tiếng nhạc vọng từ xa. Cú xử lý thế nào?', o: [
        { k: 'T', t: 'Bật nhạc nhẹ hoặc đọc thành tiếng cho át đi.' },
        { k: 'V', t: 'Kéo rèm, dọn bàn gọn để mắt thấy sạch sẽ.' },
        { k: 'M', t: 'Đổi chỗ ngồi hoặc đứng học một lát cho tỉnh.' }] },
      { name: 'Tự kiểm tra', say: 'Cú muốn xem mình nhớ được bao nhiêu.', o: [
        { k: 'V', t: 'Nhắm mắt, nhớ lại sơ đồ đã vẽ.' },
        { k: 'T', t: 'Tự hỏi tự đáp thành tiếng, hoặc thu âm lại.' },
        { k: 'M', t: 'Làm đề, viết ra giấy rồi tự chấm.' }] },
      { name: 'Sáng ngày thi', say: 'Sáng hôm thi, Cú hồi hộp. Cú làm gì để vững tâm?', o: [
        { k: 'M', t: 'Vận động nhẹ, hít thở và đi bộ một vòng.' },
        { k: 'T', t: 'Nhẩm lại những câu mình đã đọc to hôm qua.' },
        { k: 'V', t: 'Liếc lại sơ đồ lần cuối và nhìn đồng hồ.' }] }
    ],
    lead: 'Bạn là', labels: { s: 'Điểm mạnh', p: 'Dễ gặp khi học', f: 'Mẹo học hợp với bạn' },
    types: {
      T: { name: 'Cú Thính Giác', who: 'Học tốt nhất bằng tai', shape: { kind: 'ring', c: '#8FA8FF', c2: '#C4D0FF', core: '#FFFFFF' },
        s: 'Nghe là nhớ, giỏi tiếp thu qua giảng bài, thảo luận, kể chuyện.', p: 'Dễ mất tập trung khi quá ồn hoặc khi chỉ có chữ khô khan.', f: 'Đọc to, thu âm bài, giảng lại cho bạn, học nhóm, nghe podcast bài giảng.' },
      V: { name: 'Cú Thị Giác', who: 'Học tốt nhất bằng mắt', shape: { kind: 'hex', c: '#F2C14E', c2: '#E3A72F', core: '#FFF6D6' },
        s: 'Nhìn là nhớ, giỏi hình dung, màu sắc, sơ đồ, bố cục.', p: 'Dễ rối khi tài liệu lộn xộn hoặc chỉ nghe giảng bằng lời.', f: 'Sơ đồ tư duy, tô màu, thẻ ghi nhớ có hình, bảng tổng hợp một trang.' },
      M: { name: 'Cú Vận Động', who: 'Học tốt nhất bằng tay chân', shape: { kind: 'gear', n: 8, r: 17, c: '#6FCF97', core: '#E6FBEF' },
        s: 'Làm là nhớ, học nhanh qua thực hành, thí nghiệm, trải nghiệm.', p: 'Dễ sốt ruột khi phải ngồi yên lâu chỉ để đọc.', f: 'Làm bài tập thật, vừa đi vừa nhẩm, tự tay viết, dạy lại bằng ví dụ.' }
    },
    note: 'Trò chơi vui, mang tính gợi ý. Ai cũng học bằng nhiều cách, bài test phong cách học tập cho bạn thấy cách nào đang trội hơn.',
    cta: { label: 'Làm bài test phong cách học tập', href: '/testhoctap' }
  };

  /* ---------------------------------------------------------------- CHIM ÉN → PHONG CÁCH GẮN BÓ */
  G.en = {
    id: 'en', url: '/chim-en-tim-to', hud: 'Chim Én tìm tổ', thumb: 'Chim Én, đi tìm một chiếc tổ để về',
    leadsTo: 'Dẫn tới bài test phong cách gắn bó', seoTitle: 'Chim Én tìm tổ | Trò chơi phong cách gắn bó',
    seoDesc: 'Trò chơi 1 phút về cách bạn gắn bó trong các mối quan hệ: chọn thay Chim Én qua 6 tình huống. Sophia Nguyễn.',
    title: 'Chim Én sẽ tìm thấy chiếc tổ kiểu nào?', sub: 'Sáu tình huống giữa Én và bạn thân. Bạn chọn cách Én phản ứng.',
    char: { kind: 'bird', rewardY: 16, rewardScale: 1 },
    sky: [['#8EC9F2', '#EAF6FF'], ['#7DB8E8', '#F6EEDC'], ['#8FA8DC', '#FBE2C6'], ['#B39BD2', '#F8C7B0'], ['#D58AA8', '#F6A98C'], ['#5B4B8C', '#E58C7A'], ['#2D2F66', '#8E5F9A']],
    hills: { far: ['#8FC4A8', '#3F4F7A'], near: ['#6FB08E', '#2E3F66'], ground: ['#4C8F6C', '#1D2B4D'] },
    sunUp: [24, 26, 20, 10, -2, -14, -26], stars: [0, 0, 0, .1, .3, .7, 1], celestial: 'sun',
    stations: [
      { name: 'Tin nhắn chưa trả lời', say: 'Én nhắn cho bạn Chích Bông, nhưng một ngày trôi qua vẫn chưa có hồi âm.', o: [
        { k: 'A', t: 'Nghĩ chắc bạn bận, rồi làm việc của mình.' },
        { k: 'B', t: 'Mở tin nhắn xem đi xem lại, tự hỏi có phải mình làm gì sai.' },
        { k: 'C', t: 'Thấy nhẹ nhõm vì được yên, tự mình làm cũng ổn.' },
        { k: 'D', t: 'Vừa muốn nhắn thêm vừa sợ làm phiền, cuối cùng chẳng làm gì.' }] },
      { name: 'Chích Bông bận rộn', say: 'Chích Bông báo tuần này bận, hẹn Én tuần sau.', o: [
        { k: 'A', t: 'Hiểu và hẹn lại, vẫn nhắn nhẹ vài câu hỏi thăm.' },
        { k: 'B', t: 'Chạnh lòng, sợ bạn đang xa dần mình.' },
        { k: 'C', t: 'Thấy bình thường, Én cũng quen ở một mình.' },
        { k: 'D', t: 'Hơi tổn thương nhưng không nói, rồi lại tự trách mình.' }] },
      { name: 'Cơn bão ập tới', say: 'Có cơn bão lớn, Én thấy rất sợ.', o: [
        { k: 'A', t: 'Nói với bạn thân là mình đang sợ, nhờ bạn ở cạnh.' },
        { k: 'B', t: 'Gọi liên tục, phải nghe bạn trả lời mới yên tâm.' },
        { k: 'C', t: 'Giữ im lặng, tự lo một mình.' },
        { k: 'D', t: 'Muốn có bạn ở cạnh nhưng lại đẩy bạn ra.' }] },
      { name: 'Hiểu lầm nhỏ', say: 'Hai bạn lỡ nói nặng lời với nhau.', o: [
        { k: 'A', t: 'Bình tĩnh lại rồi nói chuyện cho rõ.' },
        { k: 'B', t: 'Xin lỗi ngay, dù chưa chắc mình sai.' },
        { k: 'C', t: 'Rút lui một thời gian, không muốn nói thêm.' },
        { k: 'D', t: 'Lúc giận lúc muốn làm lành, chính Én cũng thấy rối.' }] },
      { name: 'Một chiếc tổ chung', say: 'Chích Bông mời Én dọn về ở chung một tổ.', o: [
        { k: 'A', t: 'Vui, và nói rõ những điều mình cần.' },
        { k: 'B', t: 'Vui nhưng lo bạn sẽ đổi ý.' },
        { k: 'C', t: 'Thấy hơi ngợp, cần giữ một góc riêng thật rộng.' },
        { k: 'D', t: 'Vừa háo hức vừa sợ. Hôm nay nhận lời, mai lại muốn rút.' }] },
      { name: 'Hoàng hôn', say: 'Én nhìn hoàng hôn. Trong các mối quan hệ, Én mong điều gì nhất?', o: [
        { k: 'A', t: 'Gần gũi mà vẫn là chính mình.' },
        { k: 'B', t: 'Được chắc chắn rằng mình quan trọng.' },
        { k: 'C', t: 'Có đủ không gian để thở.' },
        { k: 'D', t: 'Được an toàn, không sợ bị tổn thương.' }] }
    ],
    lead: 'Én của bạn là', labels: { s: 'Điều bạn đang làm tốt', p: 'Điều dễ xảy ra', f: 'Điều có thể giúp' },
    types: {
      A: { name: 'Én Biết Tựa', who: 'Gắn bó an toàn', shape: { kind: 'heart', c: '#5DBB86', core: '#E4F8EC' },
        s: 'Gần gũi mà không mất mình, dám nói điều mình cần.', p: 'Đôi khi quên rằng người khác chưa chắc ai cũng thoải mái như mình.', f: 'Giữ thói quen nói thật và lắng nghe. Đó là chỗ dựa cho cả hai bên.' },
      B: { name: 'Én Hay Ngóng', who: 'Gắn bó lo âu', shape: { kind: 'sparkle', c: '#F2A53A', core: '#FFF1D2' },
        s: 'Quan tâm sâu sắc, nhạy cảm với người mình thương.', p: 'Dễ lo bị bỏ rơi, hay chờ tin nhắn và tự trách khi bạn im lặng.', f: 'Gọi tên nỗi lo thay vì chịu một mình, và dần học cách tự trấn an.' },
      C: { name: 'Én Bay Một Mình', who: 'Gắn bó tránh né', shape: { kind: 'moon', c: '#6CA7E8', core: '#EAF3FF' },
        s: 'Độc lập, bình tĩnh, biết tự lo cho mình.', p: 'Dễ rút lui khi mối quan hệ trở nên gần và đòi hỏi bộc lộ cảm xúc.', f: 'Thử chia sẻ một điều nhỏ mỗi lần. Gần hơn một chút không làm mình mất tự do.' },
      D: { name: 'Én Giữa Hai Bờ', who: 'Gắn bó bất an, lẫn lộn', shape: { kind: 'ring', c: '#E8707A', c2: '#F6B0B6', core: '#FFFFFF' },
        s: 'Cảm xúc phong phú, khao khát được gần gũi một cách thật lòng.', p: 'Vừa muốn gần vừa sợ bị tổn thương, nên dễ đẩy và kéo người khác.', f: 'Có một người đáng tin để nói chuyện, và nhờ chuyên gia đồng hành nếu thấy rối nhiều.' }
    },
    note: 'Trò chơi vui, không phải chẩn đoán. Cách gắn bó có thể thay đổi theo thời gian và trải nghiệm. Bài test đầy đủ cho bạn nhiều gợi ý hơn.',
    cta: { label: 'Làm bài test phong cách gắn bó', href: '/testganbo' },
    cta2: { label: 'Muốn nói chuyện với Sophia', href: '/tuvan-tamly1' }
  };

  /* ---------------------------------------------------------------- GẤU MẸ → QUIZ TUỔI DẬY THÌ + KHÓA HỌC */
  G.gau = {
    id: 'gau', url: '/gau-me-va-gau-con', hud: 'Gấu Mẹ và Gấu Con', thumb: 'Gấu Mẹ và Gấu Con tuổi dậy thì',
    leadsTo: 'Dành cho cha mẹ, dẫn tới quiz tuổi dậy thì', seoTitle: 'Gấu Mẹ và Gấu Con | Trò chơi cho cha mẹ của tuổi dậy thì',
    seoDesc: 'Trò chơi 1 phút cho cha mẹ: chọn thay Gấu Mẹ trước sáu tình huống với Gấu Con tuổi dậy thì. Sophia Nguyễn.',
    title: 'Gấu Mẹ sẽ là ngọn đèn kiểu nào?', sub: 'Sáu tình huống với Gấu Con tuổi dậy thì. Bạn chọn cách Gấu Mẹ đáp lại.',
    char: { kind: 'bear', rewardY: 16, rewardScale: 1 },
    sky: [['#F7D6B0', '#FFEEDA'], ['#F4C59B', '#FFE2C2'], ['#EDB08E', '#FFD3B0'], ['#D99A8C', '#F6BFA0'], ['#A5788F', '#E5A090'], ['#6B5683', '#C98597'], ['#3E3A6E', '#8F6B93']],
    hills: { far: ['#C9B38A', '#4A4A7A'], near: ['#B09A6E', '#38386A'], ground: ['#8A7650', '#26274F'] },
    sunUp: [26, 24, 18, 8, -4, -16, -28], stars: [0, 0, 0, 0, .2, .6, 1], celestial: 'sun',
    stations: [
      { name: 'Cánh cửa đóng', say: 'Gấu Con đi học về, đóng cửa phòng và không ra ăn cơm.', o: [
        { k: 'H', t: 'Gõ cửa nhẹ: “Mẹ ở ngoài này nếu con muốn nói.”' },
        { k: 'D', t: 'Mang cơm vào tận phòng, hỏi han xem có chuyện gì.' },
        { k: 'B', t: 'Hỏi dồn: hôm nay xảy ra chuyện gì, nói mẹ nghe ngay.' },
        { k: 'K', t: 'Để con yên, đói rồi con sẽ tự ra.' }] },
      { name: 'Điểm số tuột dốc', say: 'Bài kiểm tra của Gấu Con kém hơn mọi khi.', o: [
        { k: 'H', t: 'Hỏi con thấy thế nào trước, rồi cùng tìm cách.' },
        { k: 'D', t: 'An ủi con, rồi nhận về mình việc kèm con học lại.' },
        { k: 'B', t: 'Lập ngay thời gian biểu ôn tập cho con.' },
        { k: 'K', t: 'Bảo con không sao, miễn con vui là được.' }] },
      { name: 'Điện thoại lúc khuya', say: 'Nửa đêm, Gấu Con vẫn dán mắt vào điện thoại.', o: [
        { k: 'H', t: 'Cùng con bàn quy tắc dùng điện thoại, con được góp ý.' },
        { k: 'D', t: 'Nhắc nhẹ rồi lặng lẽ cất điện thoại giúp con.' },
        { k: 'B', t: 'Đặt luật cứng: quá giờ là bị tịch thu.' },
        { k: 'K', t: 'Mặc kệ, chắc con tự biết giờ.' }] },
      { name: 'Chuyện bạn bè', say: 'Gấu Con kể về một người bạn mới mà Gấu Mẹ chưa quen.', o: [
        { k: 'H', t: 'Tò mò hỏi về bạn, mời bạn qua nhà chơi.' },
        { k: 'D', t: 'Lo lắng, muốn biết bạn là ai, nhà ở đâu.' },
        { k: 'B', t: 'Tìm hiểu kỹ về bạn đó trước khi cho chơi.' },
        { k: 'K', t: 'Tin con, con chơi với ai cũng được.' }] },
      { name: 'Một lời nặng', say: 'Gấu Con lỡ nói một câu làm Gấu Mẹ tổn thương.', o: [
        { k: 'H', t: 'Bình tĩnh nói “mẹ buồn”, rồi nghe con giải thích.' },
        { k: 'D', t: 'Nuốt xuống, sợ nói ra con sẽ giận thêm.' },
        { k: 'B', t: 'Nghiêm khắc nhắc ngay để con nhớ không tái phạm.' },
        { k: 'K', t: 'Cho qua, trẻ con ai chẳng có lúc nói bậy.' }] },
      { name: 'Hoàng hôn', say: 'Cuối ngày, Gấu Mẹ ngồi nghĩ về con. Điều mẹ mong nhất là gì?', o: [
        { k: 'H', t: 'Con biết mẹ luôn ở cạnh, dù con chọn đường nào.' },
        { k: 'D', t: 'Con bình an, không phải chịu khổ.' },
        { k: 'B', t: 'Con đi đúng đường, không lạc lối.' },
        { k: 'K', t: 'Con vui và được tự do làm điều con thích.' }] }
    ],
    lead: 'Gấu Mẹ của bạn là', labels: { s: 'Điểm mạnh', p: 'Điều cần để ý', f: 'Gợi ý nhỏ' },
    types: {
      H: { name: 'Ngọn Hải Đăng', who: 'Đồng hành, đứng đủ gần', shape: { kind: 'star', n: 8, r1: 27, r2: 14, c: '#F5C84A', core: '#FFF7D1' },
        s: 'Vừa giữ ranh giới vừa lắng nghe, con biết mình luôn được đón nhận.', p: 'Kiểu này tốn sức vì phải bình tĩnh nhiều, cha mẹ cũng cần được nghỉ.', f: 'Giữ thói quen hỏi trước, khuyên sau. Và nhớ chăm sóc cả bản thân mình.' },
      D: { name: 'Chiếc Dù Che Chắn', who: 'Bao bọc, luôn đứng chắn mưa', shape: { kind: 'ring', c: '#6FA8E8', c2: '#A8CBF4', core: '#FFFFFF' },
        s: 'Rất thương con, luôn sẵn sàng ở đó khi con cần.', p: 'Dễ làm thay con, con ít có cơ hội tự va chạm và tự đứng dậy.', f: 'Thử để con tự làm một việc nhỏ mỗi tuần, mẹ đứng gần nhưng không làm hộ.' },
      B: { name: 'Tấm Bản Đồ', who: 'Dẫn đường, chỉ từng bước', shape: { kind: 'hex', c: '#7BB38F', c2: '#5A9A73', core: '#E6F6EC' },
        s: 'Rõ ràng, có kế hoạch, giúp con có khuôn khổ và biết điều gì được mong đợi.', p: 'Con tuổi dậy thì dễ cảm thấy bị kiểm soát và giấu mẹ nhiều hơn.', f: 'Giữ ít luật, giải thích lý do, và để con có tiếng nói trong những luật còn lại.' },
      K: { name: 'Cánh Diều Thả Gió', who: 'Thả lỏng, tin con', shape: { kind: 'petals', n: 6, rx: 10, ry: 14, d: 15, c: '#F2A0C0', c2: '#E87AA4', core: '#FFF0B8', r: 7 },
        s: 'Tôn trọng con, không áp lực, con thấy thoải mái khi ở nhà.', p: 'Đôi khi con hiểu thành “mẹ không quan tâm” và thiếu người dẫn đường.', f: 'Vẫn tin con, nhưng hỏi thăm đều đặn và giữ vài quy tắc nền tảng về an toàn.' }
    },
    note: 'Trò chơi vui, không có kiểu cha mẹ hoàn hảo. Tuổi dậy thì thay đổi nhanh, cách đáp lại cũng cần linh hoạt theo từng ngày.',
    cta: { label: 'Làm quiz: Con bạn đang ở đâu?', href: '/testsangloc' },
    cta2: { label: 'Khóa học dành cho phụ huynh', href: '/khoa-hoc' }
  };

  root.GAMES = G;
  root.GAME_ORDER = ['mam', 'cao', 'cu', 'en', 'gau'];
})(typeof window !== 'undefined' ? window : globalThis);
