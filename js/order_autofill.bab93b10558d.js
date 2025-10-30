(function($){
  'use strict';

  // gunakan path root endpoint (app di-include di root urls => /get-book-editors/)
  var ENDPOINT = '/get-book-editors/';

  function findEditorInput() {
    return $('#id_editor_name, input[name="editor_name"], textarea#id_editor_name, textarea[name="editor_name"]');
  }

  function setEditorValue(names) {
    var input = findEditorInput();
    var value = Array.isArray(names) ? names.join(', ') : (names || '');
    if (input.length) {
      input.val(value).trigger('change');
    } else {
      var label = $('label').filter(function(){ return /editor/i.test($(this).text()); }).first();
      if (label.length) {
        var target = label.closest('.form-row, .form-group').find('.form-control, p, div').first();
        if (target.length) target.text(value);
      }
    }
  }

  function fetchEditors(bookId) {
    if (!bookId) { setEditorValue([]); return; }
    $.ajax({
      url: ENDPOINT,
      method: 'GET',
      data: { book_id: bookId },
      dataType: 'json'
    }).done(function(data){
      setEditorValue(data.editors || []);
    }).fail(function(){
      setEditorValue([]);
    });
  }

  function attachHandlers() {
    var selector = '#id_book, select[name="book"], select.admin-autocomplete';
    var sel = $(selector).first();
    if (!sel.length) return;
    sel.off('.order_autofill').on('change.order_autofill', function(){
      fetchEditors(this.value);
    });
    $(document).off('select2:select.order_autofill').on('select2:select.order_autofill', selector, function(){
      fetchEditors($(this).val());
    });
    if (sel.val()) fetchEditors(sel.val());
  }

  $(function(){
    attachHandlers();
    var mo = new MutationObserver(function(muts){
      for (var i=0;i<muts.length;i++){
        if (muts[i].addedNodes && muts[i].addedNodes.length) { attachHandlers(); break; }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  });

})(window.django && django.jQuery ? django.jQuery : (window.jQuery || $));