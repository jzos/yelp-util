/**
 * Created by jaimemac on 1/20/16.
 */
(function() {

    $(document).ready(function(){

        var sYelpName;

        $("#twitter_table_data").hide();


        function request(url, data, methodType, contentType, response, error) {

            $.ajax({
                contentType: "application/json; charset=utf-8",
                method: methodType,
                url: url,
                dataType: contentType,
                data: data,
                error: function (error) {
                    console.log("Error : " + error.status + " " + error.statusText)
                }
            })
                .done(response);
        }


        $("#btn_createStore").click(function(){

            sYelpName = $("#store_name").val();

            $("#twitter_table_data").show();

            $("#company_name").val(sYelpName);

            $(".csv-form").hide();



        });





        $("#btn_save").click(function(){
            getData();
        });


        function getData()
        {

            var arrayResult = [];

            $('#twitter_table_data tbody tr').each(function () {

                var jsonTemp = {};

                $(this).find('td input').each(function () {

                    var title = $(this).attr("name");

                    // regular expression to remove commas, ascii and carriage returns
                    // these affect the export of the csv file
                    var value = ($(this).val() == "" ? "N/A" : $(this).val().replace(/[^\x00-\x7F]|(\r|\n)|[,]/g, ""));

                    jsonTemp[title] = value;

                });

                /*
                $(this).find('td option:selected').each(function () {

                    var title = $(this).parent().attr("name");
                    var value = $(this).val();

                    jsonTemp[title] = value;

                });
                */

                arrayResult.push(jsonTemp);

            });

            request("exportCSV", JSON.stringify(arrayResult), "POST", "json", null, null);

        }



    });

})();