
AFRAME.registerComponent('mars-camera', {
    init: function() {
        var data = this.data;
        var el = this.el;
        this.el.addEventListener('raycaster-intersection', els => {
            this.intersection = els.detail.intersections[0];
        });
        this.el.addEventListener('raycaster-intersection-cleared', els => {
            this.intersection = null;
        });
    },
    update: function() {
    },
    tick: function (time, timeDelta) {
        if (this.intersection ) {
            if (this.intersection.point.y > 0){
                this.el.object3D.position.y += 0.05;
            } 
        } else if (this.el.object3D.position.y > 1 ) {
            this.el.object3D.position.y -= 0.05;
        }
    }
})