# Reveal plate: Anvil room, Lime/Highlighter light shafts through a slatted grille.
# Usage: Blender -b --factory-startup --python plates/reveal.py -- <out_dir> [single_frame]
import math
import os
import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_dir = os.path.abspath(argv[0] if argv else "public/plates/reveal")
single = int(argv[1]) if len(argv) > 1 else None
os.makedirs(out_dir, exist_ok=True)

FPS, FRAMES = 30, 124  # 2 bars at 116 BPM
SHAFTS_ON = 62  # beat 4 of the act


def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]


scene = bpy.data.scenes.new("reveal")
bpy.context.window.scene = scene
engines = [i.identifier for i in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
scene.render.engine = next(e for e in engines if "EEVEE" in e)
scene.render.fps = FPS
scene.frame_start, scene.frame_end = 1, FRAMES
scene.render.resolution_x, scene.render.resolution_y = 1920, 1080
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.render.filepath = os.path.join(out_dir, "####")
scene.render.use_motion_blur = True
scene.render.motion_blur_shutter = 0.5
scene.render.dither_intensity = 1.5
scene.view_settings.view_transform = "AgX"
ee = scene.eevee
for attr, val in (("volumetric_tile_size", "4"), ("volumetric_samples", 96), ("taa_render_samples", 64),
                  ("volumetric_end", 60.0), ("use_volumetric_shadows", True)):
    if hasattr(ee, attr):
        try:
            setattr(ee, attr, val)
        except (TypeError, ValueError):
            pass

world = bpy.data.worlds.new("reveal_world")
scene.world = world
world.use_nodes = True
wn = world.node_tree.nodes
bg = next(n for n in wn if n.type == "BACKGROUND")
bg.inputs[0].default_value = (*srgb("#0E1718"), 1)
bg.inputs[1].default_value = 1.0
vol = wn.new("ShaderNodeVolumePrincipled")
vol.inputs["Density"].default_value = 0.018
vol.inputs["Anisotropy"].default_value = 0.55
world.node_tree.links.new(vol.outputs[0], next(n for n in wn if n.type == "OUTPUT_WORLD").inputs["Volume"])


def link(obj):
    scene.collection.objects.link(obj)
    return obj


# Back wall in Anvil so the room reads dark, not black
mesh = bpy.data.meshes.new("wall")
mesh.from_pydata([(-30, 12, -12), (30, 12, -12), (30, 12, 24), (-30, 12, 24)], [], [(0, 1, 2, 3)])
wall = link(bpy.data.objects.new("wall", mesh))
mat = bpy.data.materials.new("anvil")
mat.use_nodes = True
bsdf = next(n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
bsdf.inputs["Base Color"].default_value = (*srgb("#1C2C2E"), 1)
bsdf.inputs["Roughness"].default_value = 0.9
wall.data.materials.append(mat)

# Slatted grille overhead: shafts come through the gaps
grille_mat = bpy.data.materials.new("grille")
grille_mat.use_nodes = True
gb = next(n for n in grille_mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
gb.inputs["Base Color"].default_value = (0.01, 0.01, 0.01, 1)
for i in range(-10, 10):
    bpy.ops.mesh.primitive_cube_add(size=1)
    slat = bpy.context.active_object
    bpy.context.collection.objects.unlink(slat)
    link(slat)
    slat.scale = (0.8, 14, 0.15)
    slat.location = ((i + 0.5) * 1.25, 4, 10)
    slat.data.materials.append(grille_mat)


def spot(name, x, color, energy):
    data = bpy.data.lights.new(name, "SPOT")
    data.color = srgb(color)
    data.energy = energy
    data.spot_size = math.radians(70)
    data.spot_blend = 0.4
    data.shadow_soft_size = 0.05
    obj = link(bpy.data.objects.new(name, data))
    obj.location = (x, 4, 18)
    obj.rotation_euler = (math.radians(-8), math.radians(x * 1.2), 0)
    return data


lights = [spot("key", 0, "#EEFF97", 45000), spot("left", -6, "#A0CB05", 20000), spot("right", 6, "#A0CB05", 20000)]
for d in lights:
    base = d.energy
    for f, k in ((1, 0.0), (SHAFTS_ON - 6, 0.04), (SHAFTS_ON + 10, 1.0), (FRAMES, 1.25)):
        d.energy = base * k
        d.keyframe_insert("energy", frame=f)

cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 28
cam = link(bpy.data.objects.new("cam", cam_data))
scene.camera = cam
for f, z in ((1, -1.2), (FRAMES, -0.6)):
    cam.location = (0, -16, z)
    cam.rotation_euler = (math.radians(98), 0, 0)
    cam.keyframe_insert("location", frame=f)

if single:
    scene.frame_set(single)
    scene.render.filepath = os.path.join(out_dir, f"test_{single:04d}.png")
    bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
