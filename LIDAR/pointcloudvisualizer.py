import open3d as o3d

pcd = o3d.io.read_point_cloud("test_pcd.pcd")
o3d.visualization.draw_geometries([pcd], window_name="PCD Viewer")