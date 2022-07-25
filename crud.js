$(document).ready(function () {
  let prodEditId = null;

  const fetchProduct = () => {
    $.ajax({
      url: "https://quangbuiminh.com/api/products",
      type: "GET",
    }).done(function (ketqua) {
      let datas = ketqua.data;
      if (datas.length == 0) {
        html +=
          '<tr><th colspan="9" style="text-align: center">Không có kết quả phù hợp</th></tr>';
        tableBody.innerHTML = html;
        return;
      }

      renderProduct(datas);

      $(".btn.btn-danger.btnDelete").click(function () {
        const prodId = this.getAttribute("data-id");
        const isOk = confirm(`Bạn chắc chắn xóa sản phẩm có id: ${prodId} ?`);
        if (isOk) {
          deleteProduct(prodId);
        }
      });
      $(".editbtn.btn.btn-secondary.btnEdit").click(function () {
        const prodId = this.getAttribute("data-id");
        prodEditId = prodId;

        $.ajax({
          type: "GET",
          url: `https://quangbuiminh.com/api/products/${prodId}`,
          dataType: "JSON",
          encode: true,
        }).done((result) => {
          $("#inputName-edit").val(result.data.name);
          $("#inputPrice-edit").val(result.data.price);
          $("#inputQuantity-edit").val(result.data.quantity);
          $("#inputDescription-edit").val(result.data.description);
          $("#inputProductSite-edit").val(result.data.product_site);
          $("#inputCreatedBy-edit").val(result.data.created_by);
        });
      });

    

      });
    };

  const renderProduct = (datas) => {
    let html = "";
    let tableBody = document.getElementById("load-du-lieu");
    for (let i = 0; i < datas.length; i++) {
      html += "<tr>";
      html += "<td>" + datas[i].id + "</td>";
      html += "<td>" + datas[i].name + "</td>";
      html += "<td>" + (datas[i].price == null ? "" : datas[i].price) + "</td>";
      html +=
        "<td>" +
        (datas[i].description == null ? "" : datas[i].description) +
        "</td>";
      html += "<td>" + datas[i].quantity + "</td>";
      html +=
        "<td>" +
        (datas[i].product_site == null ? "" : datas[i].product_site) +
        "</td>";
      html +=
        "<td>" +
        (datas[i].created_by == null ? "" : datas[i].created_by) +
        "</td>";
      html +=
        '<td><button type="button" class="editbtn btn btn-secondary btnEdit" data-id="' +
        datas[i].id +
        '" data-target="#edit" data-toggle="modal">Edit</button></td>';
      html +=
        '<td><div class="container"><button type="button" class="btn btn-danger btnDelete" data-toggle="modal" data-id="' +
        datas[i].id +
        '" data-target="#myModal">Delete</button></div></td>';
      // data-dismiss="modal"
      html += "</tr>";
    }
    tableBody.innerHTML = html;
  };

  const deleteProduct = (prodId) => {
    $.ajax({
      type: "DELETE",
      url: `https://quangbuiminh.com/api/products/${prodId}`,
      dataType: "JSON",
      encode: true,
    }).done((result) => {
      console.log(result);
      fetchProduct();
      return result;
    });
  };

  const editProduct = (prodId, data) => {
    $.ajax({
      type: "POST",
      url: `https://quangbuiminh.com/api/products/${prodId}`,
      dataType: "JSON",
      data: data,
      encode: true,
    }).done((result) => {
    //   console.log(result);
      fetchProduct();
      $('#btnClose-edit').click();
      return result;
    });
  };

  $("#formInput-add").on("submit", function (event) {
    event.preventDefault();
    // // let id = formInput.find('#id').val();
    const data = {
      name: $("#inputName").val(),
      price: $("#inputPrice").val(),
      quantity: $("#inputQuantity").val(),
      description: $("#inputDescription").val(),
      product_site: $("#inputProductSite").val(),
      created_by: $("#inputCreatedBy").val(),
    };

    $.ajax({
      type: "POST",
      url: "https://quangbuiminh.com/api/products",
      dataType: "JSON",
      data: data,
      encode: true,
    }).done(() => {
        fetchProduct();
        $('#btnClose-add').click();
    });
  });

  $("#formInput-edit").on("submit", function (event) {
    event.preventDefault();

    const data = {
      name: $("#inputName-edit").val(),
      price: $("#inputPrice-edit").val(),
      quantity: $("#inputQuantity-edit").val(),
      description: $("#inputDescription-edit").val(),
      product_site: $("#inputProductSite-edit").val(),
      created_by: $("#inputCreatedBy-edit").val(),
    };

    editProduct(prodEditId, data);
  });
  fetchProduct();

  $('#filterForm').on('submit', function(event){
    event.preventDefault();
    let field = $('#field').val();
    let value = $('#searchValue').val();

    $.ajax({
        type: "GET",
        url: "https://quangbuiminh.com/api/products/search",
        dataType: "JSON",
        data: {
            field: field,
            value: value,
        },
      }).done((result) => {
          data = result.data;
          renderProduct(data);
      });
    
  })


$('.filerbtn.btn.btn-secondary').click(function(event) {
    event.preventDefault();
    fetchProduct();  
  });
});
