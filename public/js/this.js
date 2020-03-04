(function() {
    window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation(); }
            form.classList.add('was-validated'); }, false);
        }); }, false);
})();

$('.modal').modal('show');
$('.modal').css("z-index", "1500");

// table = $('#list_data').DataTable( {
//     paging: false,
//     buttons: [
//         'csv', 
//         'excel',
//         'pdf'
//     ]
// } );
 
// table.destroy();

// $(document).ready(function() {
//     $('#list_data').DataTable( {
//         dom: 'Bfrtip',
//         buttons: [
//             'csv', 'excel', 'pdf'
//         ]
//     } );
// } );

$('textarea.ckeditor').ckeditor();

$(document).ready(function() {
    $('#list_data').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'pdf',
        ],
    });
});

$(document).ready(function() {
    $('#list_data_table1').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'pdf'
        ]
    });
});

$(document).ready(function() {
    $('#list_data_table2').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'pdf'
        ]
    });
});

$('.tombol-hapus').on('click', function (e) {
    e.preventDefault();
    const href = $(this).attr('href');
    Swal.fire({
        title: 'apakah anda yakin',
        text: "data ini akan di hapus?", 
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'hapus data!'
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: '',
                text: "data telah berhasil di hapus", 
                type: 'success',
            });
            document.location.href = href; }
    });
});