'use strict';

function draw_logic(){
    if(core_storage_data['mouse-lock']
      || core_mouse['down-0']){
        mouse_x = core_mouse['x'];
        mouse_y = core_mouse['y'];
    }

    core_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          // Draw rectangles if not in only lines mode.
          if(core_mode !== 1){
              canvas_setproperties({
                'properties': {
                  'fillStyle': core_entities[entity]['color'],
                },
              });

              let height = core_entities[entity]['x'] - mouse_x;
              let width = core_entities[entity]['y'] - mouse_y;
              if(core_storage_data['fixed-length'] !== 0){
                  height = core_storage_data['fixed-length'];
                  width = core_storage_data['fixed-length'];

              }else{
                  if(core_storage_data['length-multiplier'] !== 1){
                      height *= core_storage_data['length-multiplier'];
                      width *= core_storage_data['length-multiplier'];
                  }

                  if(core_storage_data['extra-length'] !== 0){
                      height *= core_storage_data['extra-length'];
                      width *= core_storage_data['extra-length'];
                  }
              }

              canvas_buffer.fillRect(
                core_entities[entity]['x'],
                core_entities[entity]['y'],
                height,
                width
              );
          }

          // Draw lines if not in only rectangles mode.
          if(core_mode !== 2){
              let extra_x = 0;
              let extra_y = 0;
              let target_x = mouse_x - core_entities[entity]['x'];
              let target_y = mouse_y - core_entities[entity]['y'];

              if(core_storage_data['fixed-length'] !== 0){
                  let length = Math.sqrt(
                    target_x * target_x + target_y * target_y
                  );

                  target_x /= length;
                  target_x *= core_storage_data['fixed-length'];
                  target_y /= length;
                  target_y *= core_storage_data['fixed-length'];
              }

              if(core_storage_data['length-multiplier'] !== 1){
                  target_x *= core_storage_data['length-multiplier'];
                  target_y *= core_storage_data['length-multiplier'];
              }

              if(core_storage_data['extra-length'] !== 0){
                  extra_x = mouse_x - core_entities[entity]['x'];
                  extra_y = mouse_y - core_entities[entity]['y'];

                  let length = Math.sqrt(
                    extra_x * extra_x + extra_y * extra_y
                  );

                  extra_x /= length;
                  extra_x *= core_storage_data['extra-length'];
                  extra_y /= length;
                  extra_y *= core_storage_data['extra-length'];
              }

              canvas_draw_path({
                'properties': {
                  'strokeStyle': core_entities[entity]['color'],
                },
                'style': 'stroke',
                'vertices': [
                  {
                    'type': 'moveTo',
                    'x': core_entities[entity]['x'],
                    'y': core_entities[entity]['y'],
                  },
                  {
                    'x': core_entities[entity]['x'] + target_x + extra_x,
                    'y': core_entities[entity]['y'] + target_y + extra_y,
                  },
                ],
              });
          }
      },
    });
}

function repo_init(){
    core_repo_init({
      'events': {
        'both': {
          'onclick': function(){
              canvas_setmode({
                'newgame': true,
              });
          },
        },
        'lines': {
          'onclick': function(){
              canvas_setmode({
                'mode': 1,
                'newgame': true,
              });
          },
        },
        'rectangles': {
          'onclick': function(){
              canvas_setmode({
                'mode': 2,
                'newgame': true,
              });
          },
        },
      },
      'globals': {
        'mouse_x': 0,
        'mouse_y': 0,
      },
      'info': '<input id=both type=button value=Both><input id=lines type=button value=Lines><input id=rectangles type=button value=Rectangles>',
      'keybinds': {
        72: {
          'todo': function(){
              canvas_setmode({
                'mode': core_mode,
              });
          },
        },
      },
      'menu': true,
      'mousebinds': {
        'mousedown': {},
        'mousemove': {},
      },
      'storage': {
        'extra-length': 0,
        'fixed-length': 0,
        'length-multiplier': 1,
        'line-width': 1,
        'mouse-lock': true,
        'number-of-entities': 100,
      },
      'storage-menu': '<table><tr><td><input id=number-of-entities><td>Entities'
        + '<tr><td><input id=extra-length><td>Extra Length'
        + '<tr><td><input id=fixed-length><td>Fixed Length'
        + '<tr><td><input id=length-multiplier><td>Length Multiplier'
        + '<tr><td><input id=line-width><td>Line Width'
        + '<tr><td><input id=mouse-lock type=checkbox><td>Mouse Lock</table>',
      'title': 'Warped.htm',
    });
    canvas_init();
}