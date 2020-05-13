$(document).ready(function() {
  const arrayEmail = [
    {email: 'test@gmail.com'},
    {email: 'test1@gmail.com'},
    {email: 'test2@gmail.com'},
    {email: 'test3@gmail.com'},
  ];
  $('#newslatters').modal('show');
  $('.form_newslatter').submit(function(e) {
    e.preventDefault();
    var email = $('#email').val()
    if (email.length > 0) {
      const check = arrayEmail.find(function(data) {
        return data.email === email;
      });
      if(check) {
        $('.message').html(`
        <div class="alert alert-danger">
          Email sudah terdaftar
        </div>
        `)
      } else {
        $('.message').empty();
        localStorage.setItem('email', email);
        $('#newslatters').modal('hide');
        $('#game').modal('show')
        whell_of_fortune()
      }
    } else {
      $('.message').html(`
        <div class="alert alert-danger">
          Email tidak boleh kosong
        </div>
        `)
    }
  });

  const whell_of_fortune = () => {
    var padding = {top:20, right:40, bottom:0, left:0},
      w = 500 - padding.left - padding.right,
      h = 500 - padding.top  - padding.bottom,
      r = Math.min(w, h)/2,
      rotation = 0,
      oldrotation = 0,
      picked = 100000,
      oldpick = [],
      color = d3.scale.category20();
    const data = [
      {label: 'Zonk', value: 1, result: 'anda kurang beruntung'},
      {label: 'Free Ongkir', value: 1, result: 'selamat anda mendapatkan voucher gratis ongkir'},
      {label: 'Zonk', value: 1, result: 'anda kurang beruntung'},
      {label: 'Cashback', value: 1, result: 'selamat anda mendapatkan cashback 10k'},
      {label: 'Zonk', value: 1, result: 'anda kurang beruntung'},
      {label: 'Zonk', value: 1, result: 'anda kurang beruntung'},
      {label: 'Free Gimmick', value: 1, result: 'selamat anda mendapatkan voucher gratis gimmick'},
      {label: 'Zonk', value: 1, result: 'anda kurang beruntung'},
      {label: 'Zonk', value: 1, result: 'anda kurang beruntung'},
      {label: 'Paket Internet', value: 1, result: 'selamat anda mendapatkan voucher paket internet'},
      {label: 'Zonk', value: 1, result: 'anda kurang beruntung'},
    ]
    var kesempatan = 2;
    var svg = d3.select('.whell_of_fortune')
      .append("svg")
      .data([data])
      .attr("width",  w + padding.left + padding.right)
      .attr("height", h + padding.top + padding.bottom);

    var container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

    var vis = container
        .append("g");
        
    var pie = d3.layout.pie().sort(null).value(function(d){return 1;});

    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");
        

    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });

    // add the text
    arcs.append("text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
            return data[i].label;
        });

    // container.on("click", spin);

    $('#spin').on('click', function(e) {
      e.preventDefault()
      kesempatan = kesempatan - 1;
      if(kesempatan < 0) {
        $('#spin').attr('disabled', true);
        $('.messages').html(`
        <div class="alert alert-danger">
          Kesempatan sudah habis
        </div>
        `)
      } else {
        $('#spin').html(`spin (${kesempatan}x)`)
        spin();
      }
    })
    $('#spin').html(`spin (${kesempatan}x)`)

    function spin(d){
        
        container.on("click", null);

        //all slices have been seen, all done
        console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
        if(oldpick.length == data.length){
            console.log("done");
            container.on("click", null);
            return;
        }

        var  ps       = 360/data.length,
             pieslice = Math.round(1440/data.length),
             rng      = Math.floor((Math.random() * 1440) + 360);
            
        rotation = (Math.round(rng / ps) * ps);
        
        picked = Math.round(data.length - (rotation % 360)/ps);
        picked = picked >= data.length ? (picked % data.length) : picked;


        if(oldpick.indexOf(picked) !== -1){
            d3.select(this).call(spin);
            return;
        } else {
            oldpick.push(picked);
        }

        rotation += 90 - Math.round(ps/2);

        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function(){

                // mark question as seen
                d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                    .attr("fill", "#111");

                //populate question
                alert(data[picked].result)

                oldrotation = rotation;
            
                
            });
    }

    //make arrow
    svg.append("g")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
        .style({"fill":"black"});

    //draw spin circle
    // container.append("circle")
    //     .attr("cx", 0)
    //     .attr("cy", 0)
    //     .attr("r", 30)
    //     .style({"fill":"white","cursor":"pointer"});

    //spin text
    // container.append("text")
    //     .attr("x", 0)
    //     .attr("y", 5)
    //     .attr("text-anchor", "middle")
    //     .text("putar")
    //     .style({"font-weight":"bold", "font-size":"10px"});
    
    
    function rotTween(to) {
      var i = d3.interpolate(oldrotation % 360, rotation);
      return function(t) {
        return "rotate(" + i(t) + ")";
      };
    }
    
    
    function getRandomNumbers(){
        var array = new Uint16Array(1000);
        var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

        if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
            window.crypto.getRandomValues(array);
            console.log("works");
        } else {
            //no support for crypto, get crappy random numbers
            for(var i=0; i < 1000; i++){
                array[i] = Math.floor(Math.random() * 100000) + 1;
            }
        }

        return array;
    }

  }
});