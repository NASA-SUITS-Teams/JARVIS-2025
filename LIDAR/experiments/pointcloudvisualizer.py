import open3d as o3d

pcd = o3d.io.read_point_cloud("/Users/Total/Documents/GitHub/JARVIS-2025/LIDAR/pcds/lidar.pcd")
o3d.visualization.draw_geometries([pcd], window_name="PCD Viewer")