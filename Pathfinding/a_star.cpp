#include <iostream>
#include <vector>
#include <queue>
#include <cmath>
#include <limits>
#include <unordered_map>
#include <algorithm>
#include <windows.h>

extern "C" {
    struct Point {
        int x, y;
    };

    struct Compare {
        bool operator()(const std::pair<double, Point>& a, const std::pair<double, Point>& b) {
            return a.first > b.first;
        }
    };

    double weight(const Point& node1, const Point& node2, int* matrix, int cols) {
        double dx = std::abs(node2.x - node1.x);
        double dy = std::abs(node2.y - node1.y);
        double dz = std::abs(matrix[node2.x * cols + node2.y] - matrix[node1.x * cols + node1.y]);

        return sqrt(dx * dx + dy * dy + dz * dz); // Default uniform cost (modify as needed)
    }

    double heuristic(const Point& node, const Point& goal) {
        double dx = std::abs(goal.x - node.x);
        double dy = std::abs(goal.y - node.y);

        return (dx + dy) + (sqrt(2) - 2) * std::min(dx, dy); // Manhattan distance
    }

    std::vector<Point> a_star(int* matrix, int rows, int cols, Point start, Point goal) {
        std::vector<Point> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}, {-1, -1}, {-1, 1}, {1, -1}, {1, 1}};
        std::priority_queue<std::pair<double, Point>, std::vector<std::pair<double, Point>>, Compare> open_set;
        open_set.push({0, start});
        std::unordered_map<int, Point> came_from;
        std::vector<std::vector<double>> g_score(rows, std::vector<double>(cols, std::numeric_limits<double>::infinity()));
        g_score[start.x][start.y] = 0;
        std::vector<std::vector<double>> f_score(rows, std::vector<double>(cols, std::numeric_limits<double>::infinity()));
        f_score[start.x][start.y] = heuristic(start, goal);

        while (!open_set.empty()) {
            Point current = open_set.top().second;
            open_set.pop();

            if (current.x == goal.x && current.y == goal.y) {
                std::vector<Point> path;
                while (came_from.find(current.x * cols + current.y) != came_from.end()) {
                    path.push_back(current);
                    current = came_from[current.x * cols + current.y];
                }
                path.push_back(start);
                std::reverse(path.begin(), path.end());
                return path;
            }

            for (const auto& d : directions) {
                Point neighbor = {current.x + d.x, current.y + d.y};
                if (neighbor.x >= 0 && neighbor.x < rows && neighbor.y >= 0 && neighbor.y < cols) {
                    double move_cost = weight(current, neighbor, matrix, cols);
                    double tentative_g_score = g_score[current.x][current.y] + move_cost;
                    if (tentative_g_score < g_score[neighbor.x][neighbor.y]) {
                        came_from[neighbor.x * cols + neighbor.y] = current;
                        g_score[neighbor.x][neighbor.y] = tentative_g_score;
                        f_score[neighbor.x][neighbor.y] = tentative_g_score + heuristic(neighbor, goal);
                        open_set.push({f_score[neighbor.x][neighbor.y], neighbor});
                    }
                }
            }
        }
        return {}; // No path found
    }
}